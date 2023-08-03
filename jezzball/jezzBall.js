let defaultSettings = {
  score: 0,
  boardStartX: 0,
  boardStartY: 0,
  gridSquareSize: 40,

}

class Game{
  constructor(){
    this.score = 0;

    this.boardStartX = 0;
    this.boardStartY = 0;

  
    this.boardHeight = 17;  
    this.boardWidth = 25;

    this.boardArray = [];
    this.ballsArray = [];

    this.gridSquareSize = 60;

    this.boardHeight = 17;
    this.boardWidth = 25;

    this.boardArray = [];
    this.ballsArray = [];


    this.playAreaWidth = this.boardStartX + ((this.boardWidth-1) * this.gridSquareSize)
    this.playAreaHeight = this.boardStartY + ((this.boardHeight-1) * this.gridSquareSize) ;
    this.playAreaXStart  = this.boardStartX + this.gridSquareSize;
    this.playAreaYStart = this.boardStartY + this.gridSquareSize;

    this.defaultBallRadius = 20;
    this.defaultBallVelocity = 10;
    this.startingAmountOfBalls = 11

}

showGameUI(){
  //This method will show all of the UI and game data

}



}

let game = new Game();

class Level{

}

class Ball{
    constructor(x, y, r, v) {
      this.position = new p5.Vector(x, y);
      this.velocity = p5.Vector.random2D();
      this.velocity.mult(v);
      this.r = r;


      this.m = r * 0.1;
    }
    update() {
      this.position.add(this.velocity);
    }
  
    checkBoundaryCollision(gameObj) {
      if (this.position.x > gameObj.playAreaWidth - this.r ) {
        this.position.x = gameObj.playAreaWidth - this.r;
        this.velocity.x *= -1;
      }else if (this.position.x < (gameObj.playAreaXStart + this.r)) {
        this.position.x = (gameObj.playAreaXStart +this.r);
        this.velocity.x *= -1;
      }

      if (this.position.y > gameObj.playAreaHeight - this.r) {
        this.position.y = gameObj.playAreaHeight - this.r;
        this.velocity.y *= -1;
      } else if (this.position.y <(gameObj.playAreaYStart + this.r)) {
        this.position.y = (gameObj.playAreaYStart + this.r);
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
      //look into this function to see if there are any other optimizations in calculation
      console.log("distanceVect: ",distanceVect);
      console.log("distanceVectMag: ", distanceVectMag);

      let collisionNormal = distanceVect.copy().normalize();

      // need some way to reduce clumping
      let overlap = 0.5 * (distanceVectMag - minDistance);

      // Displace current ball
      this.position.x -= overlap * (this.position.x - other.position.x) / distanceVectMag;
      this.position.y -= overlap * (this.position.y - other.position.y) / distanceVectMag;
    
      // Displace other ball
      other.position.x += overlap * (this.position.x - other.position.x) / distanceVectMag;
      other.position.y += overlap * (this.position.y - other.position.y) / distanceVectMag;

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
  constructor(mouseX,mouseY){

    //calculate the grid that the mouse is currently in based on its location and other variables
    game.gridSquareSize
    game.boardStartX
    game.boardStartY

    //Need to make this a value
    game.wallOrientation

    this.x = 0
    this.y = 0
    // get the grid element for where to start the red wall
    gridRedStart = 0;

    //get the grid element for where to start the blue wall
    gridBlueStart =0;

  }

  update(){
    

  }


}

// Need to split the canvas up into a grid

// starting game area is 23 wide by 15 tall
// make squares class so that when we click inside a square position on the screen we know what square we are in
//boarder wall

function createBoard(game){

  game.boardArray.push([]);
  //Top Wall
  for(let i=0; i < game.boardWidth; i++){
      game.boardArray[0].push(
      new GridSquare(
      "greyWall",
      (i*game.gridSquareSize)+game.boardStartX,
      game.boardStartY,
      game.gridSquareSize,
      true));
  };
  //Right Wall
  for(let i=1; i < game.boardHeight-1; i++){
      game.boardArray[0].push(
      new GridSquare("greyWall",
      ((game.boardWidth-1)*game.gridSquareSize)+game.boardStartX,
      (i*game.gridSquareSize) +game.boardStartY,
      game.gridSquareSize,
      true));
  };
  //Bottom Wall
  for(let i = 0; i < game.boardWidth; i++){
    game.boardArray[0].push(
    new GridSquare(
    "greyWall",
    (i*game.gridSquareSize)+game.boardStartX,
    ((game.boardHeight-1)*game.gridSquareSize) + game.boardStartY,
    game.gridSquareSize,
    true));
  }
  //Left Wall
  for(let i=1; i < game.boardHeight-1; i++){
    game.boardArray[0].push(
    new GridSquare(
    "greyWall",
    game.boardStartX,
    (i*game.gridSquareSize)+game.boardStartY,
    game.gridSquareSize,
    true));
  }

  //Creating the empty grid spaces based on # or rows and columns set in the game object
  for(let i =1; i < game.boardHeight-1; i++){
    game.boardArray.push([]);
    for(let j =1; j < game.boardWidth-1; j++){
      game.boardArray[i].push(new GridSquare("empty",
                                        j*game.gridSquareSize+game.boardStartX,
                                        i*game.gridSquareSize + game.boardStartY,
                                        game.gridSquareSize,
                                        false));};
};

  //This is bad, change this
  //Creates the starting # of balls
  for(let i = 1; i <= game.startingAmountOfBalls; i++){
  game.ballsArray.push(new Ball((game.boardStartX+game.gridSquareSize+((game.defaultBallRadius+50)*i)),
                               (game.boardStartY+game.gridSquareSize+game.defaultBallRadius*2),
                                game.defaultBallRadius, game.defaultBallVelocity));
  };

}

function setup(){
  createCanvas(1600,1600);
  frameRate(48);

  createBoard(game)
// Creating the Boarder Walls
//Top Wall
 


}

function draw(){
  background(0);  
  //This is iterating through the boardArray and calling the .show() method on all of the elements in the array
  //This means all of these elements need to have a show() method built into them  
  for(let i =0; i < game.boardArray.length; i++){
        for(let j=0; j < game.boardArray[i].length; j++){
            game.boardArray[i][j].show();
        };
  };

  for (let i = 0; i < game.ballsArray.length; i++) {
    let b = game.ballsArray[i];
    b.update();
    b.display();
    b.checkBoundaryCollision(game);  

    //Pairwise comparison to check for collisions between all of the balls
    for(let j = i+1; j < game.ballsArray.length; j++){
      game.ballsArray[i].checkCollisionStaticV(game.ballsArray[j]);
    
    };
  };
};

// large number of elements collision detection optimizations.
function sweepAndPruneCollisionCheck(){
  //Sort all balls by one axis
  ballsArray.sort((a ,b) => a.position.x - b.position.x);
}

function uniformGridPartitionCollisionCheck(){
  //You must create a grid sub-dividing the game area into sections
}



// Notes Section
// https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#words-of-caution
