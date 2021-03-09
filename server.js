const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`)
});

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

// connect Socket with server
const io = require('socket.io')(http);

 
io.on('connection', (socket) => {
    console.log('Connected to server go to browser and check!');
    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });
});
