
import * as evt from "./internalCommEvent.js";

class SocketClient {
    constructor(_url = "http://localhost:3000") {
        this.mainServerUrl = _url;
        this.mainServerSocket = null;  // Instantiate the socket to null, it should not be declared until connect
        this.gameServerUrl = null;
        this.gameServerSocket = null;
        this.playerId = null;
        this.LGSList = [];
        this.connectStatus = {
            connectedToLobby: false,
            connectedToGame: false
        }
    }

    //Connect to main server to get the list of LGS
    connectToMainServer() {
        this.mainServerSocket = io(this.mainServerUrl);
        this.mainServerSocket.on('connect', () => {
            this.connectStatus.connectedToLobby = true;
            evt.dispatchEvent(evt.eventNames.connected_to_main_server, this.connectStatus);
            console.log("connected to main server");
            this.getLGSList();
            document.addEventListener(evt.eventNames.refresh_game_servers_list, (e) => {
                this.getLGSList();
            }
            );
            //if asked try to connect to game server
            document.addEventListener(evt.eventNames.connect_to_game_server, (e) => {
                console.log("connect to game server event received: " + JSON.stringify(e.detail));
                this.connectToGameServer(e.detail);
            }
            );
        });
        this.mainServerSocket.on('disconnect', () => {
            this.connectStatus.connectedToLobby = false;
            this.connectStatus.connectedToGame = false;
            evt.dispatchEvent(evt.eventNames.disconnected_from_main_server, this.connectStatus);
            console.log("disconnected from main server");
        });
        this.mainServerSocket.on('LGSList', (LGSList) => {
            this.LGSList = LGSList;
            console.log("LGSList received: " + JSON.stringify(this.LGSList));
            evt.dispatchEvent(evt.eventNames.obtained_game_servers_list, this.LGSList);
        });
    }

    /**
     * Ask the main server for the list of game servers
     */

    getLGSList() {
        this.mainServerSocket.emit('getLGSList');
        console.log("getLGSList sent");
    }

    /**
    * Connect to the game server
    */
    connectToGameServer(_gameServerUrl) {
        this.gameServerUrl = _gameServerUrl;
        //disconnect from previous game server if any
        if (this.gameServerSocket) {
            this.gameServerSocket.disconnect();
        }
       
        console.log("connecting to game server: " + this.gameServerUrl);
        this.gameServerSocket = io(this.gameServerUrl);

        this.gameServerSocket.on('connect', () => {
            this.connectStatus.connectedToGame = true;
            evt.dispatchEvent(evt.eventNames.connected_to_game_server, this.connectStatus);
            console.log("connected to game server");
            //listen to all game server events and print them
            this.gameServerSocket.onAny((eventName, data) => {
                console.log("game server event received: " + eventName + " " + JSON.stringify(data));
            })
            this.sendPlayerId(this.gameServerSocket);        
            }); 
        this.gameServerSocket.on('disconnect', () => {
            this.connectStatus.connectedToGame = false;
            evt.dispatchEvent(evt.eventNames.disconnected_from_game_server, this.connectStatus);
            //reconnect to main server
            this.connectToMainServer();
        });
    }

    /**
     * send the player id to the game server
     * 
     * @param {*} socket
     */
    sendPlayerId(socket) {
        let pid = this.generatePlayerId();
        socket.emit('playerId', pid);
        console.log("playerId sent: " + pid);
    }

    //generate a random player id
    generatePlayerId() {
        //check if already generated on local storage
        let pid = localStorage.getItem("playerId");
        if (pid) {
            return pid;
        }
        //generate a new one
        pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("playerId", pid);
        return pid;
    }
}




//create an instance of the socket client and share it
const serverIP = "http://localhost:3000";
const socketClient = new SocketClient(serverIP);

export { socketClient };
