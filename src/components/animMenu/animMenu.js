import { createAnimMenuItem } from './animMenuItem.js';
/***
 * a grouup of animated menu items
 * and a trigger element
 * 
 * */

const animMenDefaultOptions = {
    left: 50,
    top: 50,
    trigger: {
        x0: 50,
        y0: 50,
        x1: 250,
        y1: 250,
    },
    menuItems: [
        {
            left: 50,
            top: 50,
            image: "./components/animMenu/ribbon.png",
            text: "Draw",
            action: function () {
console.log("draw");
                        },
        },
        {
            left: 50,
            top: 50,
            image: "./components/animMenu/ribbon.png",
            text: "shufle",
            action: function () {
console.log("shuffle");
                        
            },
        },
        {
            left: 50,
            top: 50,
            image: "./components/animMenu/ribbon.png",
            text: "action",
            action: function () {
console.log("action");
            },
        },
    ],
};

export const createAnimMenu = (options = animMenDefaultOptions) => {
    //a collision box to detect clicks/ touches
    let collisionBox = new fabric.Rect({
        left: options.trigger.x0,
        top: options.trigger.y0,
        width: options.trigger.x1 - options.trigger.x0,
        height: options.trigger.y1 - options.trigger.y0,
        fill: "transparent",
        selectable: false,
        //if game.debug is true, show the collision box
        borderColor: "red",
        strokeWidth: GAME.debug ? 1 : 0,
        hoverCursor: "pointer",
    });
    //list of menu items
    let menuItems = [];
    //create the menu items
    for (let i = 0; i < options.menuItems.length; i++) {
        let menuItem = createAnimMenuItem(options.menuItems[i]);
        menuItems.push(menuItem);
    }

    
    
    //create the menu group
    let menu = new InteractiveComponentGrp([collisionBox, ...menuItems], {
        left: options.left,
        top: options.top,
        selectable: false,
        clipTo: null,
        //set the anchor point to the top left corner
        originX: "left",
        originY: "top",
        scaleX: 1,
        scaleY: 1,
        onActivate: function () {
            console.log("menu activated");
            //show each menu item in sequence with a delay
            for (let i = 0; i < menuItems.length; i++) {
                setTimeout(function () {
                    menuItems[i].extend();
                }, i * 100);
            }
            animMenu.extend();
            
        },
        onDeactivate: function () {
            console.log("menu deactivated");
            //hide each menu item in sequence with a delay
            for (let i = 0; i < menuItems.length; i++) {
                setTimeout(function () {
                    menuItems[i].contract();
                }, i * 100);
            }
        }
    });
    collisionBox.on("mousedown", function (options) {
        console.log("clicked on collision box");
        //toggle the menu
        if (menu.active) {
            menu.deactivate();
        } else {
            menu.activate();
        }
    });
    GAME.canvas.add(menu);
    return menu;
}