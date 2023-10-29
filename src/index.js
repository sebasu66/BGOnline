
    const express = require('express');
    const http = require('http');
    const socketIo = require('socket.io');
    const path = require('path');

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    let state = {};
    let activeObjects = {};
    let players = [];
    let game = null;

    //app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(__dirname));
    
    //listen for /
    app.get('/', (req, res) => {
        console.log('GET /');
        //print __dirname
        console.log(__dirname);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
    );

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        //if 1st player, create a new game
        if (game == null) {
            game = new Game();
        }
        if (players.indexOf(socket.id) == -1) {
            players.push(socket.id);
            game.addPlayer(socket);
            socket.emit('getFullState', state);
        }


        socket.on('postFullState', (data) => {
            logMessageReceived('postFullState', data);
            state = data;
            //broadcast the new state to all other players
            socket.broadcast.emit('getFullState', state);
            logMessageSent('getFullState', state);
            
        });

        socket.on('addObject', (data) => {
            addObject(data);
        });

        socket.on('removeObject', (data) => {
            removeObject(data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });



function sendObjects(socket) {
        socket.emit('objects', activeObjects);
        logMessageSent('objects', activeObjects);
    }

    function addObject(data) {
        activeObjects[data.id] = data;
        sendNewObject(data)
        logMessageSent('newObject', data);
    }

    function sendNewObject(data) {
        io.sockets.emit('newObject', data);
    }

    function removeObject(data){
        delete activeObjects[data.id];
        sendRemovedObject(data);
        logMessageSent('removedObject', data);
    }

    function sendRemovedObject(data) {
        io.sockets.emit('removedObject', data);
    }

    function logMessageReceived(message, data) {
        console.log(message + " received: " + JSON.stringify(data));
    }

    function logMessageSent(message, data) {
        console.log(message + " sent: " + JSON.stringify(data));
    }

    function sendPlayerId(Socket) {
        Socket.emit('playerId', Socket.id);
        logMessageSent('playerId', Socket.id);
    }



    //game class
    class Game {
        constructor() {
            this.players = {};
            this.activeObjects = {};
            this.positions = {};
            this.turn = 0;
            this.log = [];
        }   

        addPlayer(Socket) {
            this.players[Socket.id] = Socket;
            sendPlayerId(Socket);    
            sendObjects(Socket);    
        }
    }


    server.listen(3000, () => console.log('Listening on port 3000'));
