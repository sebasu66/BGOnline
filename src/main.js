//import  {addCard } from './card.js';
import { drawUI, addLog, createButton,initUI } from './ui.js';
import {socketClient}  from './serverComunication.js';

initUI();
//listen and print all events
document.addEventListener("*", function (e) {
  console.log("event: " + e.type + " data: " + JSON.stringify(e.detail));
});
socketClient.connectToMainServer();

//star fabric canvas




//listen to the "pending_redraw" event
document.addEventListener("pending_redraw", (e) => {
   console.log("pending_redraw");
    draw();
});

//message received from the server listener
document.addEventListener("message_received", (e) => {
        addLog(e.detail);
    }
);

    drawUI(socketClient.playerId);

function draw() {
  GAME.canvas.renderAll();
}


//create add card button
function addCardButtonFunction(){
    //card optoins ojbect

const cardOptions = {
    left: 80,
    top: 80,
    stroke: "rgb(0,0,10)",
    strokeWidth: 2,
    shadow: "rgba(0,0,0,0.5) 5px 5px 5px",
    selectable: true,
    id: "card" + objects.length,
    sideUP: "front",
    frontImage: "/resources/f01.png",
    backImage: "/resources/b1.png",
    flipeable: true
  };
  
//add rge  card locally and send it to the server
let card =addCard(cardOptions);
//objects.push(card);
//send objects to the server
//socketClient.socketClient.emit('objects', objects); // Send the new position to the server
}
//createButton("addCard", 100,10,150,100, addCardButtonFunction, canvas);
//background Image TO BE DRAWN on tiles
let tablesize=10000;
fabric.Object.prototype.transparentCorners = false;

  function loadPattern(url) {
    fabric.util.loadImage(url, function(img) {
      var pattern = new fabric.Pattern({
        source: img,
        repeat: 'no-repeat',
        selectable: false,
        hasBorders: false,
        hasControls: false
      });
  
      var rectSize = img.width -5;
      for (var i = 0; i < tablesize; i += rectSize) {
        for (var j = 0; j < tablesize; j += rectSize) {
          var rect = new fabric.Rect({
            left: i,
            top: j,
            width: rectSize,
            height: rectSize,
            fill: pattern,
            selectable: false,
            hasBorders: false,
            hasControls: false
          });
          GAME.canvas.add(rect);
        }
      }
      GAME.canvas.renderAll();
    });
  }

  loadPattern('resources/green3.jpg');

GAME.canvas.on("object:moving", function (options) { });

GAME.canvas.on("object:modified", function (options) {
  addLog(
    "dragged " +
    options.target.id +
    " to " +
    options.target.left +
    "," +
    options.target.top,
    GAME.canvas
  );
  socketClient.mainServersocketClient.emit("move", {
    id: options.target.id,
    pos: { x: options.target.left, y: options.target.top },
  }); // Send the new position to the server
});


