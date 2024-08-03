const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

const validToken = 'xyz';//change this with actual you get
const serverUrl = 'http://localhost:3000';

const socket = io(serverUrl, {
    auth: { token: validToken },
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connected successfully with valid token');
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    socket.disconnect();
});

socket.on('disconnect', () => {
    console.log('Disconnected');
});
