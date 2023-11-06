import e from 'express';
import { GameCanvas } from '../canvas'; 

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let game = null;

//sets the base path to find the files to serve
//to one level up from the /server folder
//__dirname is the absolute path to the current file
app.use(express.static(path.join(__dirname, '..')));
//app.use(express.static(__dirname));

//listen for clients navigating to /
app.get('/', (req, res) => {
    console.log("REQUEST received: GET / from address: "
        , req.socket.remoteAddress, req.socket.remotePort,
        " \n query: ", req.query
    + " \n params: ", req.params
    + " \n RESPONSE:", path.join(__dirname, 'index.html'));
    res.sendFile(path.join(__dirname, 'index.html'));
}
);

//Socket.io events, communication protocol
//each socket is a client, the server can have many sockets
//a socket can: broadcast, emit, join rooms, leave rooms, etc
//io.sockets.emit sends to all sockets
//socket.broadcast.emit sends to all sockets except the sender
//socket.emit sends to the socket that triggered the event

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    //if 1st player, create a new game
    if (game == null) {
        game = new Game();
    }
    if (!game.playerIsInGame(socket.id)) {
        game.addPlayer(socket);
    }
    //send the full game state to the new player
    socket.emit('getFullState', game.loadState());
    logMessageSent('getFullState', game.loadState());

    //send the new player's id to all other players
    socket.broadcast.emit('playerJoined', socket.id);
    logMessageSent('playerJoined', socket.id);

    //add listeners for client events:

    //modify: player moved a card, etc, sends only the changes
    socket.on('modify', (data) => {
        onModify(data, socket);
    });

    socket.on('addObject', (data) => {
        onAddObject(data, socket);
    });

    socket.on('removeObject', (data) => {
        onRemoveObject(data, socket);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


function onModify(data, socket) {

    logMessageReceived('modify', data);
    //update the local game state as needed
    if (game.state[data.id]) {

        /*
        1. `game.state[data.id]`: This is accessing the `state` object of the `game` object using a dynamic key (`data.id`). The `state` object is presumably storing the state of different game entities, each identified by a unique ID.
        2. `{...game.state[data.id], ...data}`: This is creating a new object that merges the properties of `game.state[data.id]` and `data`. The spread operator (`...`) is used to include all properties from each object. If a property exists in both objects, the value from `data` will overwrite the value from `game.state[data.id]`.
        3. `game.state[data.id] = {...game.state[data.id], ...data}`: This is updating the state of the game entity identified by `data.id` with the new, merged object.*/
        game.state[data.id] = { ...game.state[data.id], ...data };

        //broadcast the new state to all other players
        socket.broadcast.emit('getFullState', state);
        logMessageSent('getFullState', state);
    } else {
        console.log("onModify: game.state[data.id] not found, resending full state");
        socket.emit('getFullState', state);
        logMessageSent('getFullState', state);
    }

}



/**
 * Socket event handler for when a new object 
 * is added to the canvas on the client side.    
 * @param {*} data  
 */
function onAddObject(data, socket) {
    //add the object to the game state
    //client message must include canvas layer
    //find the canvas layer
    //add the object to the canvas layer
    //send the new object to all connected clients
    if(game.state[data.canvas]){
        game.state[data.canvas].state.push(data);
        io.sockets.emit('addObject', data);
        logMessageSent('addObject', data);
    }
    else{
        console.log("ERROR: onAddObject: game.state[data.canvas] not found, resending full state");
    }
}

function onRemoveObject(data, socket) {

    //find the object in the game state, in the canvas layer
    //remove the object from the canvas layer
    if(game.state[data.canvas]){
        game.state[data.canvas].state = game.state[data.canvas].state.filter(function (el) {
            return el.id != data.id;
        });
        io.sockets.emit('removeObject', data);
        logMessageSent('removeObject', data);
    }else{
        console.log("ERROR: onRemoveObject: game.state[data.canvas] not found, resending full state");
    }

}

/**
 * Log a message received from a socket client
 * @param {*} message 
 * @param {*} data 
 */
function logMessageReceived(message, data) {
    console.log(message + " received: " + JSON.stringify(data));
}

/**
 * Log a message sent to a socket client
 * @param {*} message 
 * @param {*} data 
 */
function logMessageSent(message, data) {
    console.log(message + " sent: " + JSON.stringify(data));
}

function sendPlayerId(Socket) {
    Socket.emit('playerId', Socket.id);
    logMessageSent('playerId', Socket.id);
}





//game class
class Game {
    constructor(options = {
        name: "Root",
        path: "/resources/games/Root_ES/",
        players: {},
        state: {
            //a game can have many canvases
            //each canvas is a different board
            //each canvas has its own state
            canvases: [
                new GameCanvas()
            ]
        },
        turn: 0,
        log: []
    }) {
        /*game specifics hardcoded for now.*/
        this.name = options.name;
        this.path = options.path;
        this.players = options.players;
        this.state = options.state;
        this.turn = options.turn;
        this.log = options.log;
    }

    getInitialState() {
        //just return the state for now
        return this.state;
    }

    //persist game state to disk
    saveState() {
        //save state to disk
        const fs = require('fs');
        fs.writeFile('gameState.json', JSON.stringify(this.state), function (err) {
            if (err) throw err;
            console.log('saveState() - Game Saved!');
        });
    }

    //load game state from disk
    loadState() {
        const fs = require('fs');
        //file exists??
        if (!fs.existsSync('gameState.json')) {
            console.log('loadState() - Game State File Not Found!');
            return this.state;
        }
        fs.readFile('gameState.json', 'utf8', function (err, data) {
            if (err) throw err;
            this.state = JSON.parse(data);
            console.log('loadState() - Game Loaded!');
        });
    }

    //remove saved game state from disk
    deleteState() {
        const fs = require('fs');
        //file exists??
        if (!fs.existsSync('gameState.json')) {
            console.log('deleteState() - Game State File Not Found!');
            return;
        }
        fs.unlink('gameState.json', function (err) {
            if (err) throw err;
            console.log('deleteState() - Game Deleted!');
        });
    }

    playerIsInGame(playerId) {
        return this.players[playerId] != null;
    }
    addPlayer(Socket) {
        this.players[Socket.id] = Socket;
        sendPlayerId(Socket);
        sendObjects(Socket);
    }
}


server.listen(3000, () => console.log('Listening on port 3000'));
