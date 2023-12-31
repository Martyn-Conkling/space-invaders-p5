
//This is a basic bullet hell space shooter game engine I am creating in p5.js
// 

//Game State related classes 
//In Progress
class Game{
    constructor(){
      // what data should we keep track of for each game?
      this.playerScore = 0;
      this.currentLevel = 0;
      
      
    }
    
    startScreen(){

    }
    
    loadLevel(){

    }

    gameOver(){

    }


}
  
class Level{
  constructor(data){
      this.levelID = data.levelID;
      this.aliensData = data.aliensData;

      // this.alienMoveFrequency = data.alienMoveFrequency
      // What are some other important pieces of data we should keep track of for each level?
      // 
  }

  sendWave(){}
  
}


const keyPressedObject = {
  leftArrowPressed: false,
  rightArrowPressed:false,
  upArrowPressed:false,
  downArrowPressed:false,
}


//Global variables, might need refactor
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
// Note, there is currently no effect of ship or alien speed on the bullet velocity
// Also need to figure out an optimal way to calculate hit detection on the player from the numerous alien bullets


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
      // ellipseMode(CENTER);
      ellipse(this.x, this.y, 50, 50);
  }
  
  showShield(){
// I want to make some kind of directional shield, need to figure out vectors for this
    fill(1,1,250);
    ellipse(this.x, this.y, 10, 70)

  }

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


// Abstract out the core Alien class, then extend the class with different custom alien types
/* 
All Aliens need to:
this.moveProgram
this.shootProgram
move()
show()
shoot()

*/

class SuperAlien{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.speed = 7;

    this.shootProgram = {
      1: true,
     
      3:true,
    
      5:true,
    
      7:true,
     
      9:true,
      
      11:true,
      

     
      24: true,
     
    }
  }
  show(){
    fill(255, 0, 200);
    ellipse(this.x, this.y, 60, 60);
    
  }

  destroy(){
    this.toDelete = true;
  }

  move(){
    this.y += this.speed;
    if(this.y > height || this.y < -500){
      // this.toDelete = true;
      this.speed *= -1;
    }

  }

  shoot(){
    let shootNum = frameCount % 144;
   
    if(this.shootProgram[shootNum]){
     
        alienBullets.push(new AlienBullet(this.x, this.y, ship))

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
    

    shoot(){}
}

class AlienBullet{

  constructor(x,y, player){
    this.x = x;
    this.y = y;
    this.toDelete = false;
    this.bulletSpeed = 15;
    this.deathTimer = frameCount + 250;

    // Gets some interesting variance behavior based on the random range variance
    // let xDif = player.x - this.x + (random(-10,10))
    // let yDif = player.y - this.y + (random(-10,10))
    let xDif = player.x - this.x 
    let yDif = player.y - this.y 

    let absDif = Math.abs(xDif) + Math.abs(yDif);
    this.xDir =   xDif/absDif;
    this.yDir =   yDif/absDif;
    // console.log(this.xDir)
  }
  show(){
    fill(150,55,55);
    ellipse(this.x, this.y, 10, 10);
  }

  evaporate(){
    // console.log("evaporate ran")
    this.toDelete = true;
  }

  move(){
    this.x += (this.xDir * this.bulletSpeed)
    this.y += (this.yDir * this.bulletSpeed)
 
  }
  deathTimerCheck(){
    if(this.deathTimer <= frameCount){
      this.toDelete = true;
    }
  }

// hits(alien){
//     let d = dist(this.x, this.y, alien.x, alien.y);
//     if (d < 30) {
//       return true;   
//     } 
//     return false;
// }

}
 
class Bullet{
  constructor(x,y, mX,mY){
    this.x = x;
    this.y = y;
    this.toDelete = false;
    this.bulletSpeed = 15;
    this.bulletDeathTimer = frameCount + 300;

    //The calculations below will cause the bullet to keep moving towards the mouse x and y position when the bullet was fired
    let xDif = mX - this.x + (random(-10,10))
    let yDif = mY - this.y + (random(-10,10))

    let absDif = Math.abs(xDif) + Math.abs(yDif);
    this.xDir =   xDif/absDif;
    this.yDir =   yDif/absDif;

    // console.log("bullet x ratio", this.xDir, "bullet y ratio", this.yDir);
    

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
    this.x += (this.xDir * this.bulletSpeed)
    this.y += (this.yDir * this.bulletSpeed)
 
    

      
  }

  deathTimerCheck(){
    if(this.bulletDeathTimer <= frameCount){
      this.toDelete = true;
    } 
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
    
    numberOfAlienRows = 3;
    numberOfAlienColumns = 20;
    
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
    
      
      //Checks if the bullets have hit any aliens
      for (let j = 0; j < aliens.length; j++) {
        if (bullets[i].hits(aliens[j])) {
          aliens[j].destroy();
          bullets[i].evaporate();
        }
      }
    }

    
    let hitEdge = false;
    // let moveAliens = true;

  

//Moving aliens, and checking if we hit the edge of the canvas
  
      // console.log("moving the aliens")
  
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].move();
        aliens[i].show();
        aliens[i].shoot();
       
        //edge detection, maybe change the alien direction? or delete it?
        if (aliens[i].x > width || aliens[i].x < 0) {
          hitEdge = true;
        }
      }


      for(let i = 0; i < alienBullets.length; i++) {
        alienBullets[i].show();
        alienBullets[i].move();
        
      
      }

    if(frameCount % 200 === 0 ){
        //Moves and shows the alien bullets
      

      for(let i = alienBullets.length-1; i >= 0 ; i--) {
        alienBullets[i].deathTimerCheck();

        //instead of iterating through the whole bullets array, I can just slice off the front half?
      
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

function mousePressed(){
  
    let bullet = new Bullet(ship.x, ship.y, mouseX, mouseY);
      bullets.push(bullet);
  

}
function keyPressed() {
    console.log("key pressed");
    
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
  
  