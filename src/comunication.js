import { addCard } from "./fabricImpl.js";

class SocketClient {
    constructor(_url = "http://localhost:3000") {
        this.url = _url;
        this.socket = null;  // Instantiate the socket to null, it should not be declared until connect
        this.connected = false;
        this.playerId = null;
    }

    //update local view
    askForRedraw(_detail) {
        let event = new CustomEvent("pending_redraw", { detail: _detail });
        document.dispatchEvent(event);
    }
    //emit a local event with the message received for the ui layer to display
    broadcastMessage(_message, _data) {
        let event = new CustomEvent("message_received", { detail: _message + " received: " + JSON.stringify(_data) });
        document.dispatchEvent(event);
    }

    connect() {
        this.socket = io(this.url);
        this.socket.on('connect', () => {
            this.connected = true;
            console.log("connected");
            this.broadcastMessage("connected", this.url);
        });
        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log("disconnected");
            this.broadcastMessage("disconnected", this.url);
        });
        this.socket.on('getFullState', (s) => {
            updateState(s);
            this.askForRedraw("objects");

        });
        
        this.socket.on('playerId', (playerId) => {
            this.playerId = playerId;
            console.log("playerId received: " + this.playerId);
            this.broadcastMessage("playerId", this.playerId);
        });
    }

    sendMessage(_message, _data) {
        //allowed messages: create, modify, remove
        if (this.connected) {
            if (_message == "create" || _message == "modify" || _message == "remove" || _message == "postFullState") {
                this.socket.emit(_message, _data);
            } else {
                console.log("ERROR: sendMessage: message not allowed: " , _message);
            }
        }else{
            console.log("ERROR: sendMessage: not connected");
        }
    }
}

//a list of canvas layers
let gameCanvases = [];
// Store all the object instances currently created to be drawn
let objects = [];

//Json representation of the objects, keep in sync by server
let state = {};


//geerate state object by getting each object's json
//and store it in the state object
function generateLocalState() {
    for (let i = 0; i < objects.length; i++) {
        state[objects[i].id] = objects[i].toJson();
    }
}

//update the state object received from the server
function updateState(_s) {


    console.log("updateState: " + JSON.stringify(_s))

    //1.check if the object array has the object
    //if it is, update it
    //if not, add it

    for (let id in _s) {
        let found = false;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id == id) {
                found = true;
                objects[i].updateFromJson(_s[id]);
            }
        }
        if (!found) {
            //add the object
            addCard(_s[id], false);
        }
    }


}


//post the state object to the server
 const syncWithServer = () => {
    if(socket && socket.connected){
    generateLocalState();
    socket.sendMessage("postFullState", state);
    }
}


//global variable to store the socket client
let socket = new SocketClient("http://localhost:3000", objects);

export { socket, objects, SocketClient, syncWithServer };
