// Game state
let gameState = {
    points: 1000,
    currentMeme: null,
    currentPrice: 0,
    consensus: 50,
    leaderboard: [],
    auctionTimer: null,
    auctionDuration: 30, // seconds
    timeLeft: 30
};

// Sample memes (in a real app, this would come from a server)
const sampleMemes = [
    {
        id: 1,
        title: "PopPik Classic",
        image: "https://i.imgur.com/8tMUxoP.png",
        description: "A rare PopPik meme from the early days"
    },
    {
        id: 2,
        title: "PopPik Legend",
        image: "https://i.imgur.com/3pzRj9n.png",
        description: "One of the most popular PopPik memes"
    },
    {
        id: 3,
        title: "PopPik Viral",
        image: "https://i.imgur.com/example3.png",
        description: "A viral PopPik meme that broke the internet"
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

// Initialize game
function initGame() {
    updatePointsDisplay();
    startNewAuction();
    setupEventListeners();
    loadLeaderboard();
}

// Update points display
function updatePointsDisplay() {
    pointsDisplay.textContent = gameState.points;
}

// Start new auction
function startNewAuction() {
    // Select random meme
    gameState.currentMeme = sampleMemes[Math.floor(Math.random() * sampleMemes.length)];
    gameState.currentPrice = 0;
    gameState.consensus = 50;
    gameState.timeLeft = gameState.auctionDuration;

    // Update UI
    memeImage.src = gameState.currentMeme.image;
    memeTitle.textContent = gameState.currentMeme.title;
    memeDescription.textContent = gameState.currentMeme.description;
    currentPrice.textContent = gameState.currentPrice;
    updateConsensusDisplay();

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
            name: "PopPik Player " + Math.floor(Math.random() * 1000),
            points: gameState.currentPrice,
            meme: gameState.currentMeme.title
        };
        addToLeaderboard(winner);
        saveLeaderboard();
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

    // Reset timer
    gameState.timeLeft = gameState.auctionDuration;
}

// Update consensus
function updateConsensus(direction) {
    const change = direction === 'up' ? 5 : -5;
    gameState.consensus = Math.max(0, Math.min(100, gameState.consensus + change));
    updateConsensusDisplay();
    
    // Adjust price based on consensus
    const priceMultiplier = 1 + (gameState.consensus - 50) / 100;
    gameState.currentPrice = Math.round(gameState.currentPrice * priceMultiplier);
    currentPrice.textContent = gameState.currentPrice;
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

// Setup event listeners
function setupEventListeners() {
    placeBidButton.addEventListener('click', placeBid);
    voteUpButton.addEventListener('click', () => updateConsensus('up'));
    voteDownButton.addEventListener('click', () => updateConsensus('down'));
}

// Start the game
initGame(); 