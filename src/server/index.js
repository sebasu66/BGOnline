import GameCanvas from './GameCanvas.js';

//import express
import express from 'express';

import { createServer } from 'http';
//import socket.io
import { Server as SocketIO } from 'socket.io';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import Game from "./Game.js"
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


let game = null;

//sets the base path to find the files to serve
//to one level up from the /server folder
//__dirname is the absolute path to the current file
app.use(express.static(join(__dirname, '..')));
//app.use(express.static(__dirname));

//listen for clients navigating to /
app.get('/', (req, res) => {
    console.log("REQUEST received: GET / from address: "
        , req.socket.remoteAddress, req.socket.remotePort,
        " \n query: ", req.query
    + " \n params: ", req.params
    + " \n RESPONSE:", join(__dirname, 'index.html'));
    res.sendFile(join(__dirname, 'index.html'));
}
);

const start = "==============================================================================================" +
    "\r\n====== BGOnline SERVER START  ======================================  [replace] =========" +
    "\r\n=============================================================================================="

    //get the ip address of the server
    //use 0.0.0.0 to listen to all addresses
server.listen(3000, () => console.log(start.replace("[replace]", server.address().address + ":" + server.address().port)));


//a list of Local Game servers who have registered 
let gameServers = [];

//Socket.io events, communication protocol
//each socket is a client, the server can have many sockets
//a socket can: broadcast, emit, join rooms, leave rooms, etc
//io.sockets.emit sends to all sockets
//socket.broadcast.emit sends to all sockets except the sender
//socket.emit sends to the socket that triggered the event

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    //is this socket a game server? 
     // wait for the game server to call register
        socket.on('register', (data) => {
            //get socket public ip address if possible
            let ip = socket.request.connection.remoteAddress;
            console.log('Game server connected, id ={}, ip={}', socket.id, ip);                          
            logMessageReceived('register',  data);
            gameServers.push({
                "id": socket.id,
                "name": data.name, "url": data.url, "players": 0
            });
            io.sockets.emit('LGSList', gameServers);
            //on disconnect, remove the game server from the list
            socket.on('disconnect', () => {
                console.log('Game server disconnected');
                gameServers = gameServers.filter(function (el) {
                    return el.id != socket.id;
                });
                io.sockets.emit('LGSList', gameServers);
            });
        });

    //is this socket a game client?

    socket.on('getLGSList', () => {
        logMessageReceived('getLGSList');
        socket.emit('LGSList', gameServers);
        logMessageSent('LGSList', gameServers);
   }   ); //send the list of game servers to the client

});


   

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
    console.log(message + " sent: " + data);
}

