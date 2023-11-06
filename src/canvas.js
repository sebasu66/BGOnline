export class GameCanvas {
    //TODO: read options from a file inside each game folder
    constructor(options = {
        name: "mainBoard",
        width: 5000,
        height: 5000,
        genericCardProperties: {
            stroke: "rgb(0,0,10)",
            strokeWidth: 5,
            shadow: "rgba(0,0,0,0.5) 10px 10px 10px",
            selectable: true,
            backImage: "/resources/games/Root_ES/cards/back.png",
            flipeable: true
        },
        state: {//cards, tokens, etc
            cards: [
                //add generic card properties
                {
                    id: "card1",
                    sideUp: "front",
                    frontImage: "/resources/games/Root_ES/cards/f1.png",
                    left: 80,
                    top: 80,
                    //assign generic card properties
                    generic: options.genericCardProperties
                }
            ],
        }
    }) {
        this.name = options.name;
        this.width = options.width;
        this.height = options.height;
        this.state = options.state;
    }//end constructor 
}