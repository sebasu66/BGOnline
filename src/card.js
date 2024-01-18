//import { socket, syncWithServer } from './serverComunication.js';
//import { addLog } from "./ui.js";






function addCard(options, propagate = true, callback = function (card) { }) {
  let card = new fabric.Image.fromURL(options.frontImage, function (card) {
    card.set({
      left: options.left,
      top: options.top,
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
      shadow: options.shadow,
      selectable: options.selectable,
      id: options.id,
      sideUP: options.sideUP,
      frontImage: options.frontImage,
      backImage: options.backImage,
      flipeable: options.flipeable,
      //dragStart: dragObj(card),
      //ddddragEnd: dragObjEnd(card),
      //TODO: move to compsonent actions
      flip: function () {
        //swith the image to cardGenBkg
        card.sideUP = card.sideUP == "back" ? "front" : "back";
        //animate the flip
        card.animate(
          { scaleX: 0, left: "+=100" },
          {
            duration: 250,
            onChange: GAME.canvas.renderAll.bind(GAME.canvas),
            onComplete: function () {
              card.setSrc(
                card.sideUP == "front"
                  ? card.frontImage
                  : card.backImage,
                function (card) { }
              );
              card.animate(
                { scaleX: 1, left: "-=100" },
                {
                  duration: 250,
                  onChange: GAME.canvas.renderAll.bind(GAME.canvas),
                  onComplete: function () { },
                }
              );
            },
            easing: fabric.util.ease.easeInOutQuad,
          }
        );
      },
      toJson: function () {
        const options = {
          left: this.left,
          top: this.top,
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          shadow: this.shadow,
          selectable: this.selectable,
          id: this.id,
          sideUP: this.sideUP,
          frontImage: this.frontImage,
          backImage: this.backImage,
          flipeable: this.flipeable,
        };
        return options;
      }
    }

    );
    const filter = new fabric.Image.filters.Noise({
      noise: 15,
    });
    card.filters.push(filter);
    card.applyFilters();

    //listen for clicks on the card, and flip it
    //let isDragging = false;
    //card.canBeDragged = () => {return true};
    
    //GAME.canvas.add(card);
    GAME.objects.push(card);
    if (propagate) {
      //only when the card is added locally
      //send the new state to the server to be propagated
      //to the other players
      //syncWithServer();
    }
    callback(card)
  }

  );
}

export {addCard}