
import fabric from 'fabric';

class CompPosition {
    constructor(id, left, top, insideContainer) {}
}

const defaultCanvasProperties = {
    name: "mainBoard",
    width: 5000,
    height: 5000,
    state: {//cards, tokens, etc currently on the board
        /*components: [
            //a single card
            {
                id: "card1",
                left: 80,
                top: 80,
            }
        ],
        decks: [
            {
                id: "mainDeck",
                cards: ["card1"],
                
            }
        ]
        */
    }
}

class GameCanvas {
    //TODO: read options from a file inside each game folder
    constructor(//default values 
        options = defaultCanvasProperties
        ) {//constructor body
        this.name = options.name;
        this.width = options.width;
        this.height = options.height;
        this.state = options.state;
        this.canvasComponents = []
    }
    addComponent (component) {
        this.canvasComponents.push(component);
        //updateState();
    }

}

export default GameCanvas;