import GameCanvas from "./GameCanvas.js"
import fs from 'fs';
import {getComponentList} from './gameComponents.js' 

//game class
class Game {
    constructor(options = {
        name: "Root",
        players: {},
        components:getComponentList("SRV_GAME"),
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
        this.players = options.players;
        this.components = options.components;
        this.state = options.state;
        this.turn = options.turn;
        this.log = options.log;
        console.log("Game constructor running with options: ", options)
    }

    getInitialState() {
        //just return the state for now
        return this.state;
    }

    //persist game state to disk
    saveState() {
        //save state to disk
        fs.writeFile('gameState.json', JSON.stringify(this.state), function (err) {
            if (err) throw err;
            console.log('Game.saveState() - Game Saved!');
        });
    }

    //load game state from disk
    loadState() {
        //file exists??
        if (!fs.existsSync('gameState.json')) {
            console.log('Game.loadState() - Game State File Not Found, return inital state');
            return this.state;
        }
        fs.readFile('gameState.json', 'utf8', function (err, data) {
            if (err) throw err;
            this.state = JSON.parse(data);
            console.log('Game.loadState() - Game Loaded!');
        });
    }

    //remove saved game state from disk
    deleteState() {
        //file exists??
        if (!fs.existsSync('gameState.json')) {
            console.log('Game.deleteState() - Game State File Not Found!');
            return;
        }
        fs.unlink('gameState.json', function (err) {
            if (err) throw err;
            console.log('Game.deleteState() - Game Deleted!');
        });
    }

    playerIsInGame(playerId) {
        return this.players[playerId] != null;
    }
    addPlayer(Socket) {
        this.players[Socket.id] = Socket;
        
    }
}

export default Game;    