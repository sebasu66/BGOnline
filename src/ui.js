//import e from "express";

let logs = [];

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
    drawLogs();
}
let logLabels = [];
function drawLogs(){
    //clear previous logs
    for(let i = 0; i < logLabels.length; i++){
        GAME.canvas.remove(logLabels[i]);
    }
    
    let alpha = 1, step = 0.2, max = logs.length > 5 ? 5 : logs.length;
    for(let i = 0; i < max; i++){
        let text = new fabric.IText(logs[i], {
            left: 10,
            top: 50 + i * 30,
            fontSize: 26,
            fill: 'black',
            selectable: false,
            opacity: alpha                                  
        });
        GAME.canvas.add(text);
        alpha -= step;
        logLabels.push(text);
    }
//    canvas.renderAll();
}
