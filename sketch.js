// https://freeinvaders.org/
//Check out this free space invaders game to see what the basic space invaders functionality is
// https://github.com/benman604/benman604.github.io/blob/v2/sketches/Cubes.js


let ship;
let aliens = [];
//We are going to set up logic to only be allowed to fire one bullet at a time
let bullets = [];
let frameCount = 0;
let alienMoveFrequency = 12;


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
  ship = new Ship();
  for (let i = 0; i < 12; i++) {
    aliens[i] = new Alien(i * 60 + 60, 60);
  }
}

function draw() {
  background(0);
  frameCount++;


  ship.show();
  ship.move();
  
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
    if(bullets[i].y < 0){
      bullets[i].evaporate();
    }
    for (let j = 0; j < aliens.length; j++) {
      if (bullets[i].hits(aliens[j])) {
        aliens[j].destroy();
        bullets[i].evaporate();
        }
    }
  }
  
  let hitEdge = false;


  let moveAliens = false;
  if(frameCount % alienMoveFrequency === 0){
    moveAliens = true;
  }

  if(moveAliens){

    for (let i = 0; i < aliens.length; i++) {
      aliens[i].show();
      aliens[i].move();
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

