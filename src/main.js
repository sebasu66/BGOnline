import  {addCard } from './fabricImpl.js';
import { drawUI, addLog, createButton } from './ui.js';
import {socket,objects} from './comunication.js';


socket.connect();   
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

    drawUI(socket.playerId);

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
//socket.socket.emit('objects', objects); // Send the new position to the server
}
createButton("addCard", 100,10,150,100, addCardButtonFunction, canvas);
//background Image TO BE DRAWN on tiles
let backgroundImage = new fabric.Image.fromURL("/resources/wood.jpg", function (
  img
) {
  img.set({
    left: 0,
    top: 0,
    width: GAME.canvas.width,
    height: GAME.canvas.height,
    selectable: false,
  });
  GAME.canvas.setBackgroundImage(img, GAME.canvas.renderAll.bind(GAME.canvas));
});

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
  socket.socket.emit("move", {
    id: options.target.id,
    pos: { x: options.target.left, y: options.target.top },
  }); // Send the new position to the server
});


