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


//create a card

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
  let card = addCard(cardOptions, false,()=>{
    console.log("card created")
GAME.canvas.add(card);
  }
  );
  
let deleteIcon = "/resources/icons/delete.png";
let cloneIcon = "/resources/icons/take.png";

const deleteObject = function (eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  };

  const cloneObject = function (eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    var clone = fabric.util.object.clone(target);
    clone.set("id", "card" + objects.length);
    clone.set("left", clone.left + 10);
    clone.set("top", clone.top + 10);
    canvas.add(clone);
    canvas.requestRenderAll();
  };

fabric.Object.prototype.setupControls= function(obj) {
    this.controls = {};  // Clear the default controls

    var deleteControl = createCustomControl(deleteIcon, deleteObject, { x: 0.5, y: -0.5, offsetY: -16, offsetX: 16 });
    var cloneControl = createCustomControl(cloneIcon, cloneObject, { x: -0.5, y: -0.5, offsetY: -16, offsetX: -16 });

    this.set('deleteControl', deleteControl);
    this.set('cloneControl', cloneControl);
  }


// Custom control creation function
function createCustomControl(imgPath, mouseUpHandler, options) {
  var iconImg = document.createElement('img');
  iconImg.src = imgPath;

  var control = new fabric.Control({
    x: options.x || 0,
    y: options.y || 0,
    offsetY: options.offsetY || 0,
    offsetX: options.offsetX || 0,
    cursorStyle: options.cursorStyle || 'pointer',
    mouseUpHandler: mouseUpHandler,
    render: renderIcon(iconImg),
    cornerSize: options.cornerSize || 24
  });

  return control;
}

// Existing renderIcon function
function renderIcon  (icon) {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    ctx.restore();
  };
}

// Event handlers to show/hide controls on long touch
var touchTimeout;
GAME.canvas.on('mouse:down', function() {
  touchTimeout = setTimeout(function() {
    var activeObject = GAME.canvas.getActiveObject();
    //if (activeObject && activeObject.type === 'Card') {
      activeObject.set('hasControls', true);
      GAME.canvas.renderAll();
    //}
  }, 1000);  // Adjust the timeout to your preference for a long touch
});

GAME.canvas.on('mouse:up', function() {
  clearTimeout(touchTimeout);
});


//card deck options
const cardDeckOptions = {
  left: 1000,
  top: 30,
  image: "/resources/baseCardDeck.png",
  label: "Deck",
  labelLeft: 40,
  labelTop: 25,
  labelFontSize: 80,
  labelFontColor: "white",
  number: "52",
  numberLeft: 230,
  numberTop: 350,
  numberFontSize: 80,
  numberFontColor: "white",
  cards: [],
};

//createDeck(cardDeckOptions);



