class Game{
    constructor(){
    this.score = 0;

}



}

class Level{

}


class Balls{
    constructor(){

    }
    //should have collision detection
    // bounce off each other

}

class GridSquare{
    constructor(type="empty",x,y,size,isWall ){
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.isWallBool = isWall;
       

        
    }


    show(index){
        stroke(0);
        strokeWeight(2)
       




        switch(this.type){
            case "empty":
                fill(200);
                square(this.x, this.y, this.size);
                break;
            case "greyWall":
                fill(100);
                square(this.x, this.y, this.size);
                line(this.x, this.y, this.x +this.size, this.y +this.size)
                line(this.x +this.size, this.y, this.x, this.y +this.size)
                break;
            case "blueWall":
                fill("blue");
                square(this.x, this.y, this.size);
                line(this.x, this.y, this.x +this.size, this.y +this.size)
                line(this.x +this.size, this.y, this.x, this.y +this.size)
                break;
            
            case "redWall":
                fill("red")
                square(this.x, this.y, this.size);
                line(this.x, this.y, this.x +this.size, this.y +this.size)
                line(this.x +this.size, this.y, this.x, this.y +this.size)
                break;
        }

        text(index, this.x+5 , this.y +(gridSquareSize/2))

    }


}

class ArrowMouse{
    constructor(){

    }

}

class ArrowWall{

}

// Need to split the canvas up into a grid
let boardStartX = 200;
let boardStartY = 200;


let gridSquareSize = 35;

let boardHeight = 17;
let boardWidth = 25;

let boardArray = [];

// starting game area is 23 wide by 15 tall
// make squares class so that when we click inside a square position on the screen we know what square we are in
//boarder wall

function setup(){
createCanvas(1500,1500);
frameRate(30);

// Creating the Boarder Walls
//Top Wall
for(let i=0; i < boardWidth; i++){
    boardArray.push(new GridSquare("greyWall",
                                    (i*gridSquareSize)+boardStartX,
                                    boardStartY,
                                    gridSquareSize,
                                    true));
}
//Right Wall
for(let i=1; i < boardHeight-1; i++){
    boardArray.push(new GridSquare("greyWall",
                                    ((boardWidth-1)*gridSquareSize)+boardStartX,
                                    (i*gridSquareSize) +boardStartY,
                                    gridSquareSize,
                                    true));
}
//Bottom Wall
for(let i = 0; i < boardWidth; i++){
    boardArray.push(new GridSquare("greyWall",
                                    (i*gridSquareSize)+boardStartX,
                                    ((boardHeight-1)*gridSquareSize) + boardStartY,
                                    gridSquareSize,
                                    true));
}
//Left Wall
for(let i=1; i < boardHeight-1; i++){
    boardArray.push(new GridSquare("greyWall",
                                    boardStartX,
                                    (i*gridSquareSize)+boardStartY,
                                    gridSquareSize,
                                    true));
}


for(let i =1; i < boardHeight-1; i++){
    for(let j =1; j < boardWidth-1; j++){
         boardArray.push(new GridSquare("empty",
                                        j*gridSquareSize+boardStartX,
                                        i*gridSquareSize + boardStartY,
                                        gridSquareSize,
                                        false));

    };
};

// boardArray.push(new Grid())

boardArray[60].type = "blueWall"
boardArray[79].type = "blueWall"
boardArray[80].type = "redWall"

}

function draw(){
    background(0);

    
    //This is iterating through the boardArray and calling the .show() method on all of the elements in the array
    //This means all of these elements need to have a show() method built into them
    
    for(let i =0; i < boardArray.length; i++){
        boardArray[i].show(i);
    }



}