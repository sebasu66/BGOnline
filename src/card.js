/**
//card class definition
export class Card {
     type= "card";
     frontImage = null;
        backImage = null;
        sideUP = "front";
        id = null;
        position = {x: 0, y: 0};
        width = 200;    
        height = 350;
        selectable = true;
        gameValue = {};
        //implement layer later
        //layer = null;
        //implement owner later
        //owner = null;
        constructor(id, frontImage, backImage, position, width, height, selectable, gameValue){
            
            this.id = id;
            this.frontImage = frontImage;
            this.backImage = backImage;
            this.position = position;
            this.width = width;
            this.height = height;
            this.selectable = selectable;
            this.gameValue = gameValue;
            this.loadFabricObject(canvas)
        }
        loadFabricObject(canvas){
            console.log("loading fabric object", this);
            let _card = this;
            _card= new fabric.Image.fromURL(_card.frontImage, function(_card) {
                _card.set({
                    left: _card.position.x,
                    top: _card.position.y,
                    stroke: 'rgb(0,0,10)',
            strokeWidth: 10 ,
                            shadow: 'rgba(0,0,0,0.5) 5px 5px 5px',
                    selectable: _card.selectable,
                    id: _card.id,
                    sideUP:"front",
                    flip: function () {
                        //swith the image to cardGenBkg
                        _card.sideUP= _card.sideUP=="back" ? "front" : "back";
                            //animate the flip
                            _card.animate({'scaleX': 0,"left":"+=100"}, {
                                duration: 500,
                                onChange: canvas.renderAll.bind(canvas),
                                onComplete: function() {
                                    _card.setSrc( this.sideUP == "front" ? _card.frontImage : _card.backImage, function(card) {});
                                      _card.animate({'scaleX': 1,"left":"-=100"}, {
                                        duration: 500,
                                        onChange: canvas.renderAll.bind(canvas),
                                        onComplete: function() {
                                        }
                                        });
                                },
                                easing: fabric.util.ease.easeInOutQuad
                              }                     
                            );
                        }
                });
                _card.scaleToWidth(_card.width);
                _card.scaleToHeight(_card.height);
            });
            canvas.add(_card);
            canvas.renderAll();
        }

        
        flip(){
            this.flip();
        }
        move(x,y){
            this.animate({'left': x,"top":y}, {
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function() {
                }
            });
        }
        getPosition(){
            return this.position;
        }
        getSide(){
            return this.sideUP;
        }   
        getGameValue(){
            return this.gameValue;
        }
        getJSON(){
            //return a json object of the card
            //frontImage, backImage, position, width, height, selectable, gameValue, sideUP
            return {
                frontImage: this.frontImage,
                backImage: this.backImage,
                position: this.position,
                width: this.width,
                height: this.height,
                selectable: this.selectable,
                gameValue: this.gameValue,
                sideUP: this.sideUP,
                id: this.id,
                type:"card"
            }

        }
    }

        

*/