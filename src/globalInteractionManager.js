//import all components
import { createInteractiveComponentGrp } from "./components/CustomFabricClasses.js";
import { createAnimMenu } from "./components/animMenu/animMenu.js";
import { addCard } from "./fabricImpl.js";


//global vvariable to store the component currently being interacted with
var currentComponent = null;


// Function to handle image click
function handleImageClick(event) {
    // Remove border from previously selected image, if any
    if (currentComponent) {
      currentComponent.style.border = '';
    }

    // Highlight the clicked image
    event.target.style.border = '2px solid red';

    // Store the clicked image
    currentComponent = event.target;
}

// Add event listener to all images with a certain class
let images = document.querySelectorAll('.interactive');
images.forEach(image => {
    image.addEventListener('click', handleImageClick);
});



//functions to activate and deactivate the interactive mode of the component

const activateInteractiveMode = (component) => {
    if (currentComponent) {
        currentComponent.deactivate();
    }
    currentComponent = component;
    component.activate();
}

const deactivateInteractiveMode = () => {
    if (currentComponent) {
        currentComponent.deactivate();
    }
    currentComponent = null;
}

//make functions available to the global scope
console.log("globalInteractionManager.js");

window.GAME = {};

GAME.activateInteractiveMode = activateInteractiveMode;
GAME.deactivateInteractiveMode = deactivateInteractiveMode;

//make the interactive component class available to the global scope

GAME.createInteractiveComponentGrp = createInteractiveComponentGrp;

//make all components available to the global scope

GAME.createAnimMenu = createAnimMenu;

//make the fabric canvas available to the global scope

GAME.canvas = new fabric.Canvas("mainCanvas", {
    //4k resolution
    width: window.innerWidth,
    height: window.innerHeight,
    name:"mainCanvas"
  });
  GAME.localObjects=[]; //component definitions
  GAME.localState={};//where each component is, only if currently included in a canvas and not
  //inside a container (deck/bag..) (canvas, sideUP(visible face/value), position, owner(user or null), locked?, private?)
  GAME.canvases=[];
  GAME.canvases.push(GAME.canvas);

// Zoom con mouse
GAME.canvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = GAME.canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.1) zoom = 0.1;
  GAME.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

// Pan con mouse
let panning = false;
GAME.canvas.on('mouse:down', function (opt) {
  panning = true;
});
GAME.canvas.on('mouse:up', function (opt) {
  panning = false;
});
GAME.canvas.on('mouse:move', function (opt) {
  if (!panning) return;
  const e = opt.e;
  const delta = new fabric.Point(e.movementX, e.movementY);
  GAME.canvas.relativePan(delta);
});

// Zoom con touch
var lastDist = 0;
GAME.canvas.on('touchstart', function(opt) {
  var e = opt.e;
  if (e.touches && e.touches.length == 2) {
    let dist = getDistance(e.touches[0], e.touches[1]);
    lastDist = dist;
  }
});
GAME.canvas.on('touchmove', function(opt) {
  var e = opt.e;
  if (e.touches && e.touches.length == 2) {
    let dist = getDistance(e.touches[0], e.touches[1]);
    let zoom = GAME.canvas.getZoom();
    zoom *= dist / lastDist;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    GAME.canvas.zoomToPoint({ x: opt.e.touches[0].clientX, y: opt.e.touches[0].clientY }, zoom);
    lastDist = dist;
  }
});
function getDistance(touch1, touch2) {
  return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
}

// Pan con touch
let lastX, lastY;
GAME.canvas.on('touchstart', function (opt) {
  var e = opt.e;
  if (e.touches && e.touches.length === 1) {
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    panning = true;
  }
});
GAME.canvas.on('touchend', function (opt) {
  panning = false;
});
GAME.canvas.on('touchmove', function (opt) {
  if (panning && e.touches && e.touches.length === 1) {
    var e = opt.e;
    var deltaX = e.touches[0].clientX - lastX;
    var deltaY = e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    var delta = new fabric.Point(deltaX, deltaY);
    GAME.canvas.relativePan(delta);
  }
});


/*
  // Función que se llama cuando el objeto comienza a moverse
function onStartMoving(e) {
  const obj = e.target; // El objeto que está siendo arrastrado
  console.log(`Start dragging ${obj.type}`);
  // Puedes llamar aquí a cualquier otra función
  ///if(obj.dragStart){
    obj.dragStart();
  //}
}

// Función que se llama cuando el objeto se suelta
function onDrop(e) {
  const obj = e.target; // El objeto que ha sido soltado
  console.log(`Dropped ${obj.type}`);
    // Puedes llamar aquí a cualquier otra función
   // if(obj.dragEnd){
        obj.dragEnd();
    //  }
}

GAME.canvas.on({
  'object:moving': onStartMoving,
  'object:modified': onDrop,
});
*/

  GAME.addCardFunction= addCard;
  
  //change zooming to use the mouse wheel

/*
  // Function to apply blur to all objects except the active one
function applyBlurToAllExceptActive() {
    
   //create a rectangle to cover the canvas
    var rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: GAME.canvas.width,
        height: GAME.canvas.height,
        fill: "rgba(0,0,0,0.5)",
        selectable: false,
        evented: false,
        id: "blurRect", 
        opacity: 0,
        //blur: 0.25
        //filters: [new fabric.Image.filters.Blur({blur: 0.25})]
        });
        //must be on top of everything except the active object
        GAME.canvas.add(rect);
        rect.moveTo(1);
        rect.opacity = 0.9;
        GAME.CanvasObscurer = rect;


    // Render the canvas to see the changes
    GAME.canvas.renderAll();
  }

  GAME.applyBlurToAllExceptActive = applyBlurToAllExceptActive;

    // Function to remove blur from all objects
function removeBlurFromAll() {

    //remove the blur rectangle
    GAME.canvas.remove(GAME.CanvasObscurer);

    GAME.canvas.renderAll();
  }

    GAME.removeBlurFromAll = removeBlurFromAll;*/
    //GAME.syncWithServer = syncWithServer;