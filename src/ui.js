/**
 * ui.js -- UI related functions
 * 
 */

import * as evt from "./internalCommEvent.js";

//listen to communication events, create an event -> callback map

let logs = [];

export function initUI() {

evt.registerEventListeners(evt.eventNames.connected_to_main_server, (e) => {
    addLog("Conectado al servidor principal");
})

evt.registerEventListeners(evt.eventNames.disconnected_from_main_server, (e) => {
    addLog("Desconectado del servidor principal");
})

evt.registerEventListeners(evt.eventNames.connected_to_game_server, (e) => {
    addLog("Conectado al servidor de juego");
})

evt.registerEventListeners(evt.eventNames.disconnected_from_game_server, (e) => {
    addLog("Desconectado del servidor de juego");
})

evt.registerEventListeners(evt.eventNames.obtained_game_servers_list, (e) => {
    updateLGSList(e.detail);
})

//set refresh button listener
let refreshButton = document.getElementById("refreshLGSListButton");
refreshButton.addEventListener("click", function () {
    console.log("refresh LGSList button clicked");
    document.dispatchEvent(new Event(evt.eventNames.refresh_game_servers_list));
}
);

}
//get  and update the table of local game servers
/*<table id="servers">
            <tr>
                <th>Server</th>
                <th>Players</th>
                <th>Join</th>
            </tr>
        </table>*/
export function updateLGSList(_LGSList) {
    let table = document.getElementById("servers");
    //clear table
    table.innerHTML = "";
    //add column titles again
    let row = table.insertRow();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();
    cell1.innerHTML = "<b>Server</b>";
    cell2.innerHTML = "<b>Players</b>";
    cell3.innerHTML = "<b>Join</b>";

    //add rows
    for (let i = 0; i < _LGSList.length; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        cell1.innerHTML = _LGSList[i].name;
        cell2.innerHTML = _LGSList[i].players;
        cell3.innerHTML = "<button onclick=\"document.dispatchEvent(new CustomEvent('connect_to_game_server', {detail: '" + _LGSList[i].url + "'}));\">Join</button>";
    }

    }



//  ----------    canvas ui      ----------------------

export function drawUI(_playerId){
    //put a label with the player id
    //on the top left corner
    //it must appear on top of the canvas
    //it must ignore the camera and interactions
    let text = new fabric.IText("PLAYER: " + _playerId, {
        left: 10,
        top: 10,
        fontSize: 16,
        fill: 'black',
        selectable: false
    });
    GAME.canvas.add(text);
}

//generic function to create a button
export function createButton(_text, _left, _top, _width, _height, _callback){
    let button = new fabric.Rect({
        left: _left,
        top: _top,
        width: _width,
        height: _height,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
    });
    let text = new fabric.IText(_text, {
        left: _left + _width / 2,
        top: _top + _height / 2,
        fontSize: 26,
        fill: 'black',
        selectable: false
    });
    let group = new fabric.Group([ button, text ], {
        left: _left,
        top: _top,
        selectable: false
    });
    group.on('mousedown', function() {
        _callback();
    });
    GAME.canvas.add(group);
}



export function addLog(_log){
    logs.push(_log);
    update_state();
}

function update_state(){
    //get the state div
    let stateDiv = document.getElementById("status-list");
    //clear the state div
    stateDiv.innerHTML = "";
    //add a ul
    let ul = document.createElement("ul");
    stateDiv.appendChild(ul);
    // and a li for each log, only the last 6 logs
    if(logs.length > 6){
        logs = logs.slice(logs.length - 6);
    }
    for(let i = 0; i < logs.length; i++){
        let li = document.createElement("li");
        li.innerHTML = logs[i];
        ul.appendChild(li);
        
    }
    
}
