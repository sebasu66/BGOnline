//import all components
import { createInteractiveComponentGrp } from "./components/CustomFabricClasses.js";
import { createAnimMenu } from "./components/animMenu/animMenu.js";
import { addCard } from "./fabricImpl.js";
import { syncWithServer } from "./comunication.js";


//global vvariable to store the component currently being interacted with
var currentComponent = null;


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

GAME.canvas = new fabric.Canvas("mainBoardCanvas", {
    //4k resolution
    width: 8400,
    height: 6600,
    name:"mainBoard"
  });

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


  GAME.addCard = addCard;
  
  //change zooming to use the mouse wheel
GAME.canvas.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = GAME.canvas.getZoom();
    console.log("zoom", zoom);
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    GAME.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

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

    GAME.removeBlurFromAll = removeBlurFromAll;
    GAME.syncWithServer = syncWithServer;