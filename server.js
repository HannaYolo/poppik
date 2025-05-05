const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').createServer(express());
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle new user connection
    socket.on('connect', (data) => {
        socket.username = data.username;
        io.emit('chat', {
            username: 'System',
            message: `${data.username} joined the auction!`
        });
    });

    // Handle bids
    socket.on('bid', (data) => {
        io.emit('bid', data);
    });

    // Handle chat messages
    socket.on('chat', (data) => {
        io.emit('chat', data);
    });

    // Handle consensus updates
    socket.on('consensus', (data) => {
        io.emit('consensus', data);
    });

    // Handle auction end
    socket.on('auction_end', (data) => {
        io.emit('auction_end', data);
    });

    // Handle new auction
    socket.on('new_auction', (data) => {
        io.emit('new_auction', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('chat', {
                username: 'System',
                message: `${socket.username} left the auction.`
            });
        }
        console.log('User disconnected:', socket.id);
    });
});

// Start server
http.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 