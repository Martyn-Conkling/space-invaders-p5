
// https://freeinvaders.org/
//Check out this free space invaders game to see what the basic space invaders functionality is



class Game{
    constructor(){
      // what data should we keep track of for each game?
       
    }
}
  
class Level{
  constructor(data){
      this.levelNumber = data.levelNumber;
      this.alienMoveFrequency = data.alienMoveFrequency
      // What are some other important pieces of data we should keep track of for each level?
  }
  
}
  
  
  
  
  
  let ship;
  let aliens = [];
  
  //We are going to set up logic to only be allowed to fire one bullet at a time, but you might want to have the option to fire multiple bullets at a time
  let bullets = [];
  
  let frameCount = 0;
  let alienMoveFrequency;

  let alienXStart;
  let alienYStart;

  let numberOfAlienRows;
  let numberOfAlienColumns;
  
  
  class Ship {
  constructor(){
      this.x = width / 2;
      this.direction = 0;
  }
    
  show(){
      fill(255);
      rectMode(CENTER);
      rect(this.x, height - 20, 20, 60);
  }
  setDir(direction){
      this.direction = direction;
  }
  
  move(){
      this.x += this.direction * 5;
  }
  }
  
  class Alien{
    constructor(x,y){
      this.x = x;
      this.y = y;
      this.direction = 1;
      this.toDelete = false;
      
      
    }
    show(){
      fill(255, 0, 200);
      ellipse(this.x, this.y, 60, 60);
      
    }
    
    destroy(){
      this.toDelete = true;  
    }
    
    move(){
      this.x = this.x + (this.direction * 10);
    }
    
    shiftDown(){
       this.y = this.y + 60;
        this.direction = this.direction * -1;
    }
  }
  //Need to add more to the bullet code so that I can only shoot 1 bullet at a time
  class Bullet{
  constructor(x,y){
      this.x = x;
      this.y = y;
      this.toDelete = false;
  }
  show(){
      fill(50, 0, 200);
      ellipse(this.x, this.y, 8, 8);
  }
      
  
  evaporate(){
      this.toDelete = true;
  }
  
  hits(alien){
      let d = dist(this.x, this.y, alien.x, alien.y);
      if (d < 30) {
        return true;   
      } 
      return false;
  }
  
  move(){
      this.y = this.y - 15;
  }
  
  }
  
  
function setup() {
    createCanvas(1000, 500);
    frameRate(24);
    //Create the player "ship"
    ship = new Ship();

    alienMoveFrequency = 12;
    alienXStart = 60;
    alienYStart = 60;
    
    numberOfAlienRows = 4;
    numberOfAlienColumns = 12;
    
    //Creates all of our Aliens
    for(let rowsIndex = 0; rowsIndex < numberOfAlienRows; rowsIndex++ ){
      for (let i = 0; i <  numberOfAlienColumns ; i++) {
        aliens.push(new Alien((i * 60) + alienXStart, (alienYStart * rowsIndex) + alienYStart)); 
      }
    }
    

  }
  
  function draw() {
    background(0);
    frameCount++;
    console.log(frameCount);
  
  
    ship.show();
    ship.move();
    
    //Moves Bullets 
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].show();
      bullets[i].move();
      //checks if the bullet is off the screen
      if(bullets[i].y < 0){
        bullets[i].evaporate();
      }
      //Checks if the bullets have hit any aliens
      for (let j = 0; j < aliens.length; j++) {
        if (bullets[i].hits(aliens[j])) {
          aliens[j].destroy();
          bullets[i].evaporate();
        }
      }
    }
    
    let hitEdge = false;
    let moveAliens = false;

  //This if statement controls how many times per second we are moving the aliens
  if(frameCount % alienMoveFrequency === 0){
      moveAliens = true;
  }

  console.log(moveAliens)

//Moving aliens, and checking if we hit the edge of the canvas
  if(moveAliens){
      console.log("moving the aliens")
  
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].move();
        aliens[i].show();
         // console.log("moved the aliens")
        if (aliens[i].x > width || aliens[i].x < 0) {
          hitEdge = true;
        }
      }
  
    } else{
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].show();
      }
  
    }
    
  //Shifts aliens down if we hit the edge
    if (hitEdge) {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].shiftDown();
  
      }
    }
  
    //deletes any bullets marked to be deleted
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].toDelete) {
        bullets.splice(i, 1);
      }
    }
    
  //deletes any aliens marked to be deleted
    for (let i = aliens.length - 1; i >= 0; i--) {
      if (aliens[i].toDelete) {
        aliens.splice(i, 1);
      }
    }
  }
  
  //Player Controls Section
  
  function keyReleased() {
    if (key != ' ') {
      ship.setDir(0);
    }
  }
  
  function keyPressed() {
    if (key === ' ') {
      if(bullets.length === 0){
        let bullet = new Bullet(ship.x, height);
        bullets.push(bullet);
      }
      
      
    }
    
    if (keyCode === RIGHT_ARROW) {
      ship.setDir(1);
  
    } else if (keyCode === LEFT_ARROW) {
      ship.setDir(-1);
  
    }
  }
  
  