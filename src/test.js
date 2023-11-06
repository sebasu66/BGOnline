import { drawUI, addLog, createButton } from './ui.js';
import {socket,objects} from './comunication.js';
//import { Intersection } from 'fabric/fabric-impl.js';


socket.connect();   

function draw() {
  GAME.canvas.renderAll();
}
//table texture

function loadCanvasBKGPattern(url) {
  let img = document.getElementById('BL');
    var pattern = new fabric.Pattern({
      source:img,
         repeat: 'repeat'
    });
  
    GAME.canvas.setBackgroundColor({source: pattern.source, repeat: 'repeat'}, function() {
      GAME.canvas.renderAll();
    });
  }

loadCanvasBKGPattern('resources/bl.jpg');
GAME.canvas.setZoom(0.5); // Zoom out to 50%

/*
const cardOptions = {
    left: 80,
    top: 80,
    stroke: "rgb(0,0,10)",
    strokeWidth: 5,
    shadow: "rgba(0,0,0,0.5) 10px 10px 10px",
    selectable: true,
    id: "card" + objects.length,
    sideUP: "front",
    frontImage: "/resources/f01.png",
    backImage: "/resources/b1.png",
    flipeable: true
  };
  let cardOptions2 = cardOptions;
  cardOptions2.frontImage = "/resources/f02.png";
  cardOptions2.left = 200;
  
  addCard(cardOptions, false,(_card)=>{
    console.log("card created")
    _card.setupControls();
GAME.canvas.add(_card);
  }
  );

  addCard(cardOptions2, false,(_card)=>{
    console.log("card created")
    _card.setupControls();
GAME.canvas.add(_card);
  }
  );
*/
  const InteractiveComponentGrpOptions = {
    left: 80,
    top: 80,
    stroke: "rgb(0,0,10)",
    strokeWidth: 5,
    shadow: "rgba(0,0,0,0.5) 10px 10px 10px",
    selectable: true,
    id: "ncard" + objects.length,
    sideUp: "front",
    frontImage: "/resources/games/Root_ES/cards/f1.png",
    backImage: "/resources/games/Root_ES/cards/back.png",
    flipeable: true
  };

  GAME.createInteractiveComponentGrp (InteractiveComponentGrpOptions, (newCard)=>{
    console.log("card created: ", newCard);
    GAME.canvas.add(newCard);
    draw();
  });


  
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
    this.controls.deleteControl = deleteControl;
    this.controls.cloneControl = cloneControl;

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
    cornerSize: options.cornerSize || 64
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
fabric.Object.prototype.on('mousedown', function( options ) {
  //get the object being clicked from the event
  var obj = options.target;
  
  console.log("mousedown on ", obj  );
  GAME.canvas.setActiveObject(obj);
  addMouseMovementListener();
  touchTimeout = setTimeout(function() {
    var activeObject = GAME.canvas.getActiveObject();
    console.log("long touch on ", activeObject  );
    
  }, 1000);  // Adjust the timeout to your preference for a long touch
});

function addMouseMovementListener() {
  fabric.Object.prototype.on('mousemove', function(options) {
    var obj = options.target;
    if (obj && obj.canBeDragged()) {
      console.log("mousemove on ", obj  );
      obj.dragStart();
    }
    
  });
}                   

function removeMouseMovementListener() {
  fabric.Object.prototype.off('mousemove');
}

fabric.Object.prototype.on('mouseup', function(options) {
  clearTimeout(touchTimeout);
  var obj = options.target;
  console.log("mouseup on ", obj  );  
  removeMouseMovementListener();
  if (obj && obj.isDragging) {
                      obj.dragEnd();
    obj.set('hasControls', true);
    GAME.canvas.renderAll();
  }
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





