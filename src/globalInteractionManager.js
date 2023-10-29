//import all components
import { InteractiveComponentGrp } from "./components/CustomFabricClasses.js";
import { createAnimMenu } from "./components/animMenu/animMenu.js";


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

GAME.InteractiveComponentGrp = InteractiveComponentGrp;

//make all components available to the global scope

GAME.createAnimMenu = createAnimMenu;

//make the fabric canvas available to the global scope

GAME.canvas = new fabric.Canvas("canvas", {
    //4k resolution
    width: 8400,
    height: 6600,
  });
  