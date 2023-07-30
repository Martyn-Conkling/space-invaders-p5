let boardStartX = 200;
let boardStartY = 200;


let gridSquareSize = 35;

let boardHeight = 17;
let boardWidth = 25;

let boardArray = [];
let ballsArray = [];


let playAreaWidth = boardStartX+ ((boardWidth-1) * gridSquareSize)
let playAreaHeight = boardStartY + ((boardHeight-1) * gridSquareSize) ;
let playAreaXStart  = boardStartX + gridSquareSize;
let playAreaYStart = boardStartY + gridSquareSize;

class Game{
    constructor(){
    this.score = 0;

}



}

class Level{

}


class Ball {
    constructor(x, y, r) {
      this.position = new p5.Vector(x, y);
      this.velocity = p5.Vector.random2D();
      this.velocity.mult(10);
      this.r = r;
      this.m = r * 0.1;
    }
    update() {
      this.position.add(this.velocity);
    }
  
    checkBoundaryCollision() {
      if (this.position.x > playAreaWidth - this.r) {
        this.position.x = playAreaWidth - this.r;
        this.velocity.x *= -1;
      }else if (this.position.x < (playAreaXStart + this.r)) {
        this.position.x = (playAreaXStart +this.r);
        this.velocity.x *= -1;
      }

      if (this.position.y > playAreaHeight - this.r) {
        this.position.y = playAreaHeight - this.r;
        this.velocity.y *= -1;
      } else if (this.position.y <(playAreaYStart + this.r)) {
        this.position.y = (playAreaYStart + this.r);
        this.velocity.y *= -1;
      }
    }
  

    // for this function we can put all of the walls that are successfully created into an array
    // Then we can run collision detection between the balls and all the walls
    // For aditional optimization, for walls that span the whole width or height of the play area, the effectively just shrink the play area
    // This allows us to have much cheaper collision detection, but we have to structure this correctly
    
  checkCollisionStaticV(other){
    let distanceVect = p5.Vector.sub(other.position, this.position);
    
    let distanceVectMag = distanceVect.mag();
   
    let minDistance = this.r + other.r;

    if (distanceVectMag < minDistance) {

      console.log("distanceVect: ",distanceVect);
      console.log("distanceVectMag: ", distanceVectMag);

      let collisionNormal = distanceVect.copy().normalize();

      // Store the original speeds
      let thisOriginalSpeed = this.velocity.mag();
      let otherOriginalSpeed = other.velocity.mag();

      // Get the components of the velocity vectors in the direction of the normal
      let thisNormalSpeed = this.velocity.dot(collisionNormal);
      let otherNormalSpeed = other.velocity.dot(collisionNormal);

      // Calculate the new velocities, but only the components in the direction of the normal
      let thisNewVel = p5.Vector.sub(this.velocity, p5.Vector.mult(collisionNormal, thisNormalSpeed - otherNormalSpeed));
      let otherNewVel = p5.Vector.sub(other.velocity, p5.Vector.mult(collisionNormal, otherNormalSpeed - thisNormalSpeed));

      // Set the new velocities
      this.velocity = thisNewVel;
      other.velocity = otherNewVel;

      // Preserve the original speeds
      this.velocity.setMag(thisOriginalSpeed);
      other.velocity.setMag(otherOriginalSpeed);
    }
      
  }



    checkCollisionPhysics(other) {
      // Get distances between the balls components
      let distanceVect = p5.Vector.sub(other.position, this.position);
  
      // Calculate magnitude of the vector separating the balls
      let distanceVectMag = distanceVect.mag();
  
      // Minimum distance before they are touching
      let minDistance = this.r + other.r;
  
      if (distanceVectMag < minDistance) {
        let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
        let d = distanceVect.copy();
        let correctionVector = d.normalize().mult(distanceCorrection);
        other.position.add(correctionVector);
        this.position.sub(correctionVector);
  
        // get angle of distanceVect
        let theta = distanceVect.heading();
        // precalculate trig values
        let sine = sin(theta);
        let cosine = cos(theta);
  
        /* bTemp will hold rotated ball this.positions. You 
         just need to worry about bTemp[1] this.position*/
        let bTemp = [new p5.Vector(), new p5.Vector()];
  
        /* this ball's this.position is relative to the other
         so you can use the vector between them (bVect) as the 
         reference point in the rotation expressions.
         bTemp[0].this.position.x and bTemp[0].this.position.y will initialize
         automatically to 0.0, which is what you want
         since b[1] will rotate around b[0] */
        bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
        bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;
  
        // rotate Temporary velocities
        let vTemp = [new p5.Vector(), new p5.Vector()];
  
        vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
        vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
        vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
        vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;
  
        /* Now that velocities are rotated, you can use 1D
         conservation of momentum equations to calculate 
         the final this.velocity along the x-axis. */
        let vFinal = [new p5.Vector(), new p5.Vector()];
  
        // final rotated this.velocity for b[0]
        vFinal[0].x =
          ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) /
          (this.m + other.m);
        vFinal[0].y = vTemp[0].y;
  
        // final rotated this.velocity for b[0]
        vFinal[1].x =
          ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) /
          (this.m + other.m);
        vFinal[1].y = vTemp[1].y;
  
        // hack to avoid clumping
        bTemp[0].x += vFinal[0].x;
        bTemp[1].x += vFinal[1].x;
  
        /* Rotate ball this.positions and velocities back
         Reverse signs in trig expressions to rotate 
         in the opposite direction */
        // rotate balls
        let bFinal = [new p5.Vector(), new p5.Vector()];
  
        bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
        bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
        bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
        bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;
  
        // update balls to screen this.position
        other.position.x = this.position.x + bFinal[1].x;
        other.position.y = this.position.y + bFinal[1].y;
  
        this.position.add(bFinal[0]);
  
        // update velocities
        this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
        this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
        other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
        other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
      }
    }
  
    display() {
      noStroke();
      fill(100,5,70);
      ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
    }
  }

class GridSquare{
    constructor(type="empty",x,y,size,isWall ){
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.isWallBool = isWall;
       

        
    }


    show(){
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

        // text(index, this.x+5 , this.y +(gridSquareSize/2))

    }


}

class ArrowMouse{
    constructor(){

    }

}

class ArrowWall{

}

// Need to split the canvas up into a grid

// starting game area is 23 wide by 15 tall
// make squares class so that when we click inside a square position on the screen we know what square we are in
//boarder wall

function setup(){
createCanvas(1500,1500);
frameRate(30);

// Creating the Boarder Walls
//Top Wall
boardArray.push([]);
for(let i=0; i < boardWidth; i++){
    boardArray[0].push(new GridSquare("greyWall",
                                    (i*gridSquareSize)+boardStartX,
                                    boardStartY,
                                    gridSquareSize,
                                    true));
}
//Right Wall
for(let i=1; i < boardHeight-1; i++){
    boardArray[0].push(new GridSquare("greyWall",
                                    ((boardWidth-1)*gridSquareSize)+boardStartX,
                                    (i*gridSquareSize) +boardStartY,
                                    gridSquareSize,
                                    true));
}
//Bottom Wall
for(let i = 0; i < boardWidth; i++){
    boardArray[0].push(new GridSquare("greyWall",
                                    (i*gridSquareSize)+boardStartX,
                                    ((boardHeight-1)*gridSquareSize) + boardStartY,
                                    gridSquareSize,
                                    true));
}
//Left Wall
for(let i=1; i < boardHeight-1; i++){
    boardArray[0].push(new GridSquare("greyWall",
                                    boardStartX,
                                    (i*gridSquareSize)+boardStartY,
                                    gridSquareSize,
                                    true));
}


for(let i =1; i < boardHeight-1; i++){
    boardArray.push([]);
    for(let j =1; j < boardWidth-1; j++){
         boardArray[i].push(new GridSquare("empty",
                                        j*gridSquareSize+boardStartX,
                                        i*gridSquareSize + boardStartY,
                                        gridSquareSize,
                                        false));

    };
};

ballsArray.push(new Ball(boardStartX+gridSquareSize+50, boardStartY+gridSquareSize+50, 20))
ballsArray.push(new Ball(boardStartX+gridSquareSize+100, boardStartY+gridSquareSize+80, 20))
ballsArray.push(new Ball(boardStartX+gridSquareSize+200, boardStartY+gridSquareSize+80, 20))

}

function draw(){
    background(0);

    
    //This is iterating through the boardArray and calling the .show() method on all of the elements in the array
    //This means all of these elements need to have a show() method built into them
    
    for(let i =0; i < boardArray.length; i++){
        for(let j=0; j < boardArray[i].length; j++){
            boardArray[i][j].show();
        }

    }

    for (let i = 0; i < ballsArray.length; i++) {
        let b = ballsArray[i];
        b.update();
        b.display();
        b.checkBoundaryCollision();  
        for(let j = 0; j < ballsArray.length-1; j++){
            for(let k = j+1; k < ballsArray.length; k++){
                ballsArray[j].checkCollisionStaticV(ballsArray[k])
    
            }
        }
     }

    //   ballsArray[0].checkCollision(ballsArray[1]);
    //   ballsArray[0].checkCollision(ballsArray[2]);
    //   ballsArray[]
    

}