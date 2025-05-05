// Game state
let gameState = {
    points: 1000,
    currentMeme: null,
    currentPrice: 0,
    consensus: 50,
    leaderboard: [],
    auctionTimer: null,
    auctionDuration: 30, // seconds
    timeLeft: 30,
    username: "Player" + Math.floor(Math.random() * 1000),
    socket: null
};

// Sample memes (in a real app, this would come from a server)
const sampleMemes = [
    {
        id: 1,
        title: "Doge",
        image: "https://i.imgur.com/8tMUxoP.png",
        description: "Much wow, very meme"
    },
    {
        id: 2,
        title: "Pepe",
        image: "https://i.imgur.com/3pzRj9n.png",
        description: "Rare Pepe"
    },
    {
        id: 3,
        title: "Stonks",
        image: "https://i.imgur.com/4t0mS7W.png",
        description: "Stonks only go up"
    },
    {
        id: 4,
        title: "Drake",
        image: "https://i.imgur.com/2tGbaL4.png",
        description: "Drake approves"
    },
    {
        id: 5,
        title: "Wojak",
        image: "https://i.imgur.com/5tH8J9K.png",
        description: "Feels bad man"
    },
    {
        id: 6,
        title: "Chad",
        image: "https://i.imgur.com/7tL2M3N.png",
        description: "Gigachad"
    },
    {
        id: 7,
        title: "Bonk",
        image: "https://i.imgur.com/8tP4Q5R.png",
        description: "Go to horny jail"
    },
    {
        id: 8,
        title: "Crying Cat",
        image: "https://i.imgur.com/9tR5S6T.png",
        description: "Sad cat hours"
    },
    {
        id: 9,
        title: "Surprised Pikachu",
        image: "https://i.imgur.com/1tU7V8W.png",
        description: "Shocked Pikachu face"
    },
    {
        id: 10,
        title: "This is Fine",
        image: "https://i.imgur.com/2tU9X8V.png",
        description: "Everything is fine"
    },
    {
        id: 11,
        title: "Distracted Boyfriend",
        image: "https://i.imgur.com/3tV0Y9W.png",
        description: "Looking at another meme"
    },
    {
        id: 12,
        title: "Change My Mind",
        image: "https://i.imgur.com/4tW1Z0X.png",
        description: "Steven Crowder meme"
    }
];

// DOM Elements
const pointsDisplay = document.getElementById('points');
const memeImage = document.getElementById('meme-image');
const memeTitle = document.getElementById('meme-title');
const memeDescription = document.getElementById('meme-description');
const currentPrice = document.getElementById('current-price');
const bidAmount = document.getElementById('bid-amount');
const placeBidButton = document.getElementById('place-bid');
const voteUpButton = document.getElementById('vote-up');
const voteDownButton = document.getElementById('vote-down');
const consensusLevel = document.getElementById('consensus-level');
const consensusValue = document.getElementById('consensus-value');
const leaderboardList = document.getElementById('leaderboard');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

// Initialize WebSocket connection
function initWebSocket() {
    // Connect to Socket.IO server
    const serverUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://poppik-server.onrender.com';
    
    gameState.socket = io(serverUrl);

    gameState.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        // Send initial connection info
        gameState.socket.emit('connect', {
            username: gameState.username
        });
    });

    gameState.socket.on('bid', (data) => {
        handleRemoteBid(data);
    });

    gameState.socket.on('chat', (data) => {
        handleChatMessage(data);
    });

    gameState.socket.on('consensus', (data) => {
        handleRemoteConsensus(data);
    });

    gameState.socket.on('auction_end', (data) => {
        handleRemoteAuctionEnd(data);
    });

    gameState.socket.on('new_auction', (data) => {
        if (data.meme) {
            gameState.currentMeme = data.meme;
            memeImage.src = gameState.currentMeme.image;
            memeTitle.textContent = gameState.currentMeme.title;
            memeDescription.textContent = gameState.currentMeme.description;
        }
    });

    gameState.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        // Try to reconnect after 5 seconds
        setTimeout(initWebSocket, 5000);
    });
}

// Handle incoming WebSocket messages
function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'bid':
            handleRemoteBid(data);
            break;
        case 'chat':
            handleChatMessage(data);
            break;
        case 'consensus':
            handleRemoteConsensus(data);
            break;
        case 'auction_end':
            handleRemoteAuctionEnd(data);
            break;
    }
}

// Handle remote bid
function handleRemoteBid(data) {
    if (data.username !== gameState.username) {
        gameState.currentPrice = data.amount;
        currentPrice.textContent = gameState.currentPrice;
        addChatMessage(`${data.username} placed a bid of ${data.amount} points!`);
    }
}

// Handle chat message
function handleChatMessage(data) {
    addChatMessage(`${data.username}: ${data.message}`);
}

// Handle remote consensus
function handleRemoteConsensus(data) {
    if (data.username !== gameState.username) {
        updateConsensus(data.direction, false);
    }
}

// Handle remote auction end
function handleRemoteAuctionEnd(data) {
    if (data.winner) {
        addChatMessage(`Auction ended! ${data.winner.username} won with ${data.winner.amount} points!`);
    }
    startNewAuction();
}

// Add chat message to the chat display
function addChatMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add meme gallery functionality
function initMemeGallery() {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'meme-gallery';
    galleryContainer.innerHTML = `
        <h2>Meme Gallery</h2>
        <div class="gallery-grid">
            ${sampleMemes.map(meme => `
                <div class="gallery-item" data-meme-id="${meme.id}">
                    <img src="${meme.image}" alt="${meme.title}">
                    <h3>${meme.title}</h3>
                </div>
            `).join('')}
        </div>
    `;

    // Insert gallery before the leaderboard
    const leaderboardSection = document.querySelector('.leaderboard-section');
    leaderboardSection.parentNode.insertBefore(galleryContainer, leaderboardSection);

    // Add click handlers for gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const memeId = parseInt(item.dataset.memeId);
            const meme = sampleMemes.find(m => m.id === memeId);
            if (meme) {
                startNewAuction(meme);
            }
        });
    });
}

// Modify startNewAuction to accept a specific meme
function startNewAuction(specificMeme = null) {
    // Select random meme or use specific meme
    gameState.currentMeme = specificMeme || sampleMemes[Math.floor(Math.random() * sampleMemes.length)];
    gameState.currentPrice = 0;
    gameState.consensus = 50;
    gameState.timeLeft = gameState.auctionDuration;

    // Update UI
    memeImage.src = gameState.currentMeme.image;
    memeTitle.textContent = gameState.currentMeme.title;
    memeDescription.textContent = gameState.currentMeme.description;
    currentPrice.textContent = gameState.currentPrice;
    updateConsensusDisplay();

    // Notify other players
    if (gameState.socket && gameState.socket.readyState === WebSocket.OPEN) {
        gameState.socket.send(JSON.stringify({
            type: 'new_auction',
            meme: gameState.currentMeme
        }));
    }

    // Start auction timer
    startAuctionTimer();
}

// Start auction timer
function startAuctionTimer() {
    if (gameState.auctionTimer) {
        clearInterval(gameState.auctionTimer);
    }

    gameState.auctionTimer = setInterval(() => {
        gameState.timeLeft--;
        
        if (gameState.timeLeft <= 0) {
            endAuction();
        }
    }, 1000);
}

// End auction
function endAuction() {
    clearInterval(gameState.auctionTimer);
    
    // Add winner to leaderboard
    if (gameState.currentPrice > 0) {
        const winner = {
            name: gameState.username,
            points: gameState.currentPrice,
            meme: gameState.currentMeme.title
        };
        addToLeaderboard(winner);
        saveLeaderboard();

        // Notify other players
        if (gameState.socket && gameState.socket.readyState === WebSocket.OPEN) {
            gameState.socket.send(JSON.stringify({
                type: 'auction_end',
                winner: winner
            }));
        }
    }

    // Start new auction after 3 seconds
    setTimeout(startNewAuction, 3000);
}

// Place bid
function placeBid() {
    const amount = parseInt(bidAmount.value);
    
    if (amount > gameState.points) {
        alert("Not enough PopPik points!");
        return;
    }

    if (amount <= gameState.currentPrice) {
        alert("Bid must be higher than current price!");
        return;
    }

    gameState.points -= amount;
    gameState.currentPrice = amount;
    updatePointsDisplay();
    currentPrice.textContent = gameState.currentPrice;

    // Notify other players
    if (gameState.socket && gameState.socket.readyState === WebSocket.OPEN) {
        gameState.socket.send(JSON.stringify({
            type: 'bid',
            username: gameState.username,
            amount: amount
        }));
    }

    // Reset timer
    gameState.timeLeft = gameState.auctionDuration;
}

// Update consensus
function updateConsensus(direction, notifyOthers = true) {
    const change = direction === 'up' ? 5 : -5;
    gameState.consensus = Math.max(0, Math.min(100, gameState.consensus + change));
    updateConsensusDisplay();
    
    // Adjust price based on consensus
    const priceMultiplier = 1 + (gameState.consensus - 50) / 100;
    gameState.currentPrice = Math.round(gameState.currentPrice * priceMultiplier);
    currentPrice.textContent = gameState.currentPrice;

    // Notify other players
    if (notifyOthers && gameState.socket && gameState.socket.readyState === WebSocket.OPEN) {
        gameState.socket.send(JSON.stringify({
            type: 'consensus',
            username: gameState.username,
            direction: direction
        }));
    }
}

// Update consensus display
function updateConsensusDisplay() {
    consensusLevel.style.width = `${gameState.consensus}%`;
    consensusValue.textContent = `${gameState.consensus}%`;
}

// Add to leaderboard
function addToLeaderboard(player) {
    gameState.leaderboard.push(player);
    gameState.leaderboard.sort((a, b) => b.points - a.points);
    gameState.leaderboard = gameState.leaderboard.slice(0, 5); // Keep top 5
    updateLeaderboardDisplay();
}

// Update leaderboard display
function updateLeaderboardDisplay() {
    leaderboardList.innerHTML = gameState.leaderboard
        .map((player, index) => `
            <div class="leaderboard-item">
                <span class="rank">#${index + 1}</span>
                <span class="name">${player.name}</span>
                <span class="meme">${player.meme}</span>
                <span class="points">${player.points} pts</span>
            </div>
        `)
        .join('');
}

// Save leaderboard to localStorage
function saveLeaderboard() {
    localStorage.setItem('poppikLeaderboard', JSON.stringify(gameState.leaderboard));
}

// Load leaderboard from localStorage
function loadLeaderboard() {
    const savedLeaderboard = localStorage.getItem('poppikLeaderboard');
    if (savedLeaderboard) {
        gameState.leaderboard = JSON.parse(savedLeaderboard);
        updateLeaderboardDisplay();
    }
}

// Send chat message
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message && gameState.socket && gameState.socket.readyState === WebSocket.OPEN) {
        gameState.socket.send(JSON.stringify({
            type: 'chat',
            username: gameState.username,
            message: message
        }));
        chatInput.value = '';
    }
}

// Setup event listeners
function setupEventListeners() {
    placeBidButton.addEventListener('click', placeBid);
    voteUpButton.addEventListener('click', () => updateConsensus('up'));
    voteDownButton.addEventListener('click', () => updateConsensus('down'));
    sendChatButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Modify initGame to include gallery initialization
function initGame() {
    updatePointsDisplay();
    initMemeGallery();
    startNewAuction();
    setupEventListeners();
    loadLeaderboard();
    initWebSocket();
}

// Update points display
function updatePointsDisplay() {
    pointsDisplay.textContent = gameState.points;
}

// Start the game
initGame();
