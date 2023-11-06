
export function createInteractiveComponentGrp(options, onComplete) {

    console.log("createInteractiveComponentGrp: ", options);
    createFrontImage(options, onComplete);
}
//create two images, one for the front and one for the back
//and add them to the group
//the front image is the one that will be displayed
//the back image is the one that will be displayed when the card is flipped

const createFrontImage = (options, onComplete) => {
    let frontImage = new fabric.Image.fromURL(options.frontImage, (frontImage) => {
        frontImage.set({
            originX: "center",
            originY: "center",
            opacity: options.sideUp == "front" ? 1 : 0,
          
        });
        console.log("frontImage: ", frontImage);
        createBackImage(frontImage, options, onComplete);
    });
}
const createBackImage = (frontImage, options, onComplete) => {
    let backImage = new fabric.Image.fromURL(options.backImage, (backImage) => {
        backImage.set({
            originX: "center",
            originY: "center",
            opacity: options.sideUp == "back" ? 1 : 0
        });
        console.log("backImage: ", backImage);
        createGroup(frontImage, backImage, options, onComplete);
    });
}

const createGroup = (frontImage, backImage, options, onComplete) => {
    // Create a new group with fabric.Group
    let group = new fabric.Group([frontImage, backImage], {
        left: options.left,
        top: options.top,
        //black stroke, 2px, opacity 0.5
        stroke: "rgb(0,0,10)",
        strokeWidth: 2,
        selectable: options.selectable,
        id: options.id,
        sideUp: options.sideUp,
        isFlipeable: options.flipeable,
        isDraggable: options.draggable ? options.draggable : true,
        isLocked: options.locked ? options.locked : false,
        isDragging: false,
        shadow: {
            color: 'rgba(0,0,0,1)',
            blur: 1,
            offsetX: 10,
            offsetY: 10
        },
        borderOpacityWhenMoving: 0.5,
        
        hasControls: false,
    });

    console.log("group: ", group);
    // Method to activate the group
    group.activate = function () {
        this.active = true;
        if (this.onActivate) {
            this.onActivate();
        }
    };

    // Method to deactivate the group
    group.deactivate = function () {
        this.active = false;
        if (this.onDeactivate) {
            this.onDeactivate();
        }
    };

    // Method to check if the group can be dragged
    group.canBeDragged = function () {
        return this.isDraggable && !this.isLocked;
    };

    // Method to initiate drag
    group.dragStart = function () {
        if (!this.canBeDragged() || this.isDragging) {
            return;
        }
        console.log("dragStart");

        let initialBlur = this.shadow.blur;
        let initialOffsetX = this.shadow.offsetX;
        let initialOffsetY = this.shadow.offsetY;

        this.animate(
            {
                scaleX: 1.1,
                scaleY: 1.1,
                shadow: {
                    //blur: 3,
                    offsetX: initialOffsetX + 25,
                    offsetY: initialOffsetY + 25
                }
            },
            {
                duration: 200,
                onChange: () => {
                    GAME.canvas.renderAll();
                },
                onComplete: function () { },
                easing: fabric.util.ease.easeInOutQuad,
            }
        );
        this.isDragging = true;
    };

    // Method to end drag
    group.dragEnd = function () {
        this.isDragging = false;

        let currentBlur = this.shadow.blur;
        let currentOffsetX = this.shadow.offsetX;
        let currentOffsetY = this.shadow.offsetY;
        this.animate(
            {
                scaleX: 1,
                scaleY: 1,
                shadow: {
                    blur: 0.1,
                    offsetX: currentOffsetX - 5,
                    offsetY: currentOffsetY - 5
                }
            },
            {
                duration: 100,
                onChange: () => {

                    GAME.canvas.renderAll();
                },
                onComplete: function () {
                    // Sync with server here
                    GAME.syncWithServer();
                },
                easing: fabric.util.ease.easeInOutQuad,
            }
        );
    };

    // Method to convert the group to JSON
    group.toJson = function () {
        const options = {
            left: this.left,
            top: this.top,
            selectable: this.selectable,
            id: this.id,
            sideUP: this.sideUP,
            frontImage: this.frontImage,
            backImage: this.backImage,
            flipeable: this.isFlipeable,
            draggable: this.isDraggable,
            locked: this.isLocked,
            canvas:GAME.canvas.name

        };
        return options;
    };

    // Method to update the group from JSON
    group.updateFromJson = function (json) {
        if (json.sideUP != this.sideUP) {
            this.flip();
        }
        this.animate(
            {
                left: json.left,
                top: json.top,
            },
            {
                duration: 100,
                onChange: GAME.canvas.renderAll.bind(GAME.canvas),
                onComplete: function () { },
                easing: fabric.util.ease.easeInOutQuad,
            }
        );
    };

    // Call onComplete function
    onComplete(group);
};



