
//This is a basic bullet hell space shooter game engine I am creating in p5.js
// 

//Game State related classes 
//In Progress

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


const keyPressedObject = {
  leftArrowPressed: false,
  rightArrowPressed:false,
  upArrowPressed:false,
  downArrowPressed:false,
}
  
let ship;
let aliens = [];
  
let bullets = [];
let alienBullets = [];

let frameCount = 0;
let alienMoveFrequency;

let alienXStart;
let alienYStart;

let numberOfAlienRows;
let numberOfAlienColumns;
  
// Game Entity classes section  
class Ship {
  constructor(){
      this.x = width / 2;
      this.y = height -50;
      this.speed = 10;
      this.xDirection = 0;
      this.yDirection = 0;
  }
    
  show(){
      fill(255);
      rectMode(CENTER);
      rect(this.x, this.y, 40, 50);
  }
  // setXDir(xDir){
  //     this.xDirection = xDir;
  // }
  // setYDir(yDir){
  //   this.yDirection = yDir;
  // }
  //figure out movement logic, so that the ship doesn't get stuck

  move(){
   if(keyPressedObject.rightArrowPressed){
    this.x += this.speed;
   }
   if(keyPressedObject.leftArrowPressed){
    this.x -= this.speed;
   }
   if(keyPressedObject.upArrowPressed){
    this.y -= this.speed;
   }
   if(keyPressedObject.downArrowPressed){
    this.y += this.speed;
   }
      
  }
  
  
  }
  
class SuperAlien{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.speed = 7;

    this.shootProgramObj = {
      1: true,
      10: true,
      12: true,
      24: true,
      60: true, 
      100: true,
    }
  }
  show(){
    fill(255, 0, 200);
    ellipse(this.x, this.y, 60, 60);
    
  }

  move(){
    this.y += this.speed;
    if(this.y > height){
      this.toDelete = true;
    }

  }

  shoot(){
    let shootNum = frameCount % 144;
   
    if(this.shootProgramObj[shootNum]){
     
        alienBullets.push(new AlienBullet(this.x, this.y))

    }
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

    shoot(){}
}

class AlienBullet{

  constructor(x,y){
    this.x = x;
    this.y = y;
    this.toDelete = false;
  }
  show(){
    fill(50, 0, 100);
    ellipse(this.x, this.y, 8, 8);
  }
  evaporate(){
    // console.log("evaporate ran")
    this.toDelete = true;
  }

// hits(alien){
//     let d = dist(this.x, this.y, alien.x, alien.y);
//     if (d < 30) {
//       return true;   
//     } 
//     return false;
// }

  move(){
    this.y = this.y += 15;

 
  }

}
 
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

function garbageCollection(){
    
  //deletes player bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      console.log("deleted player bullets");
      bullets.splice(i, 1);
    }
  }

  // deletes alien bullets
  for (let i = alienBullets.length - 1; i >= 0; i--) {
    if (alienBullets[i].toDelete) {
      console.log("deleted alien bullets");
      alienBullets.splice(i, 1);
    }
  }
    
  //deletes aliens
  for (let i = aliens.length - 1; i >= 0; i--) {
    if (aliens[i].toDelete) {
      console.log("deleted alien");
      aliens.splice(i, 1);
    }
  }

}

function setup() {
    createCanvas(windowWidth -50, windowHeight-70);
    frameRate(48);

    //Create the player "ship"
    ship = new Ship();

    alienMoveFrequency = 12;
    alienXStart = 60;
    alienYStart = -500;
    
    numberOfAlienRows = 10;
    numberOfAlienColumns = 12;
    
    //Creates all of our Aliens
    for(let rowsIndex = 0; rowsIndex < numberOfAlienRows; rowsIndex++ ){
      for (let i = 0; i <  numberOfAlienColumns ; i++) {
        aliens.push(new SuperAlien((i * 60) + alienXStart, (60 * rowsIndex) + alienYStart)); 
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

    //Moves and shows the alien bullets
    for(let i = 0; i < alienBullets.length; i++) {
      alienBullets[i].show();
      alienBullets[i].move();
      if(alienBullets[i].y > height){
        alienBullets[i].evaporate();
      }
    }
    
    let hitEdge = false;
    let moveAliens = true;

  //This if statement controls how many times per second we are moving the aliens
  // if(frameCount % alienMoveFrequency === 0){
  //     moveAliens = true;
  // }

  // console.log(moveAliens)

//Moving aliens, and checking if we hit the edge of the canvas
  if(moveAliens){
      // console.log("moving the aliens")
  
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].move();
        aliens[i].show();
        aliens[i].shoot();
       
        
        if (aliens[i].x > width || aliens[i].x < 0) {
          hitEdge = true;
        }
      }
  
    }else{
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].show();
        aliens[i].shoot()
      }
  
  };
    
  //Shifts aliens down if we hit the edge
    if (hitEdge) {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].shiftDown();
  
      }
    }
  

    garbageCollection();
    
}

//Player Controls Section
function keyReleased() {
    console.log("key released");
    switch(keyCode){
      case RIGHT_ARROW:
        keyPressedObject["rightArrowPressed"] = false;
        break;
      case LEFT_ARROW:
        keyPressedObject["leftArrowPressed"] = false;
        break;
      case UP_ARROW:
        keyPressedObject["upArrowPressed"] = false;
        break;
      case DOWN_ARROW:
        keyPressedObject["downArrowPressed"] = false;
        break;
    }
    
}
  
function keyPressed() {
    console.log("key pressed");
    if(key === ' '){
      let bullet = new Bullet(ship.x, ship.y);
        bullets.push(bullet);
    }

    switch(keyCode){
    
      case RIGHT_ARROW:
        keyPressedObject["rightArrowPressed"] = true;
        break;
      case LEFT_ARROW:
        keyPressedObject["leftArrowPressed"] = true;
        break;
      case UP_ARROW:
        keyPressedObject["upArrowPressed"] = true;
        break;
      case DOWN_ARROW:
        keyPressedObject["downArrowPressed"] = true;
        break;

    }    


    
}
  
  