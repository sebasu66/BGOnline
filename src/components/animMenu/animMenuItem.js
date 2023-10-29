
/**
 * @fileoverview animMenuitem.js creates a menu item for the animMenu
 **/

/**
 * 
 * @param {*} options : options for the menu item, including the image, text, and action
 * @param {*} callback : callback function to call when the menu item is created
 */
export const createAnimMenuItem = (options, callback = () => { }) => {
  try {
  let img = new fabric.Image.fromURL(options.image, function (img) {
    img.set({
      left: options.left,
      top: options.top,
      selectable: false,
    });
    let text = new fabric.IText(options.text, {
      //pivot on the left side of the text
      originX: "left",
      left: options.left + 680,
      top: options.top + 15,
      fontSize: 120,
      fill: "black",
      height: 80,
      width: 1500,
      selectable: false
    });
    let group = new fabric.Group([img, text], {
      visible: false,
      selectable: false,
      //start really small then animate to normal size on hover
      scaleX: 0.1,
      extend: function () {
        group.visible = true;
        group.animate(
          {
            scaleX: 1,
            scaleY: 1,
          },
          {
            duration: 200,
            onChange: GAME.canvas.renderAll.bind(GAME.canvas),
            onComplete: function () { },
            easing: fabric.util.ease.easeInOutQuad,
          }
        );

      },
      contract: function () {
        group.animate(
          {
            scaleX: 0.1,
          },
          {
            duration: 200,
            onChange: GAME.canvas.renderAll.bind(GAME.canvas),
            onComplete: function () {
              group.visible = false;
            },
            easing: fabric.util.ease.easeInOutQuad,
          }
        );
      },
    });
    GAME.canvas.add(group); 
    //listen for taps on the button
    //and perform the action
    group.on("mousedown", function () {
      console.log("anim menu item clicked");
      options.action();
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    callback(group);
    return group;
  }
  );
} catch (error) {
 //TODO: handle error, implement logging
 console.log(error);   
}
}
