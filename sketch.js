const START_LENGTH=6
let HEAD_LENGTH=3
let STARTING_NUMBER_OF_NODES=5
let SPEED=3
let FRUIT_NUMBER=4
let FRUIT_SIZE=20
let Segments;
let joystick;
let dir_x = 0;
let is_game_over=false;
let score = 0;
let highscore = 0;
let globalHighscore = 0;
let fruit=[];

function setup() {
  let h = windowWidth > windowHeight ? windowHeight : windowWidth;
  createCanvas(h, h);
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  select('canvas').style('position', 'absolute').style('top', canvasY + 'px').style('left', canvasX + 'px');
  
  let radius=h/17;
  let segment_distance=h/30;
  let node_speed=h/500*SPEED;

  Segments=new SegmentList(h/2,h/2,radius,PI/4,segment_distance,node_speed,STARTING_NUMBER_OF_NODES);
  Segments.set_direction(-3*PI/4);
  joystick = new Joystick(h, (angle) => Segments.change_direction(angle),true);
  stroke(255)
  noFill()
  textFont("JetBrains Mono");
  textAlign(CENTER, CENTER);

  highscore = localStorage.getItem('highscore') || 0;

  FRUIT_SIZE=h/100*FRUIT_SIZE;
  for (let i = 0; i < FRUIT_NUMBER; i++) {
    fruit.push(new Fruit(random(width), random(height), h / 40));
  }
}

function game_over(){
  is_game_over=true;
  if(score>highscore){
    highscore=score;
    localStorage.setItem('highscore', highscore);
  }
}

function draw() {
  background(0);
  if(!is_game_over) game();
  else draw_game_over();
}

function draw_game_over() {
  push();
  translate(0, -width/10)
  textSize(width / 10);
  fill(255);
  
  text('Game Over', width / 2, height / 2 - width / 20);
  textSize(width / 40);
  fill(200);
  text('Press Space to Restart', width / 2, height / 2 + width / 20);
  text('Press x to change account', width / 2, height / 2 + width / 10);
  
  textSize(width / 30);
  fill(255);
  text('Score: ' + score, width / 2, height / 2 + width / 5);
  text('Highscore: ' + highscore, width / 2, height / 2 + width / 4);
  text('Global Highscore: ' + globalHighscore, width / 2, height / 2 + width / 3.3);
  
  pop();
}

function game(){
  fruit.forEach((f)=>{
    f.display();
  });

  if (dir_x !== 0) {
    Segments.turn(dir_x);
  }
  
  Segments.move();
  Segments.check_collision(fruit);
  Segments.display();
  joystick.display();
}

function restart_game(){
  score=0;
  is_game_over = false;
  Segments = new SegmentList(width / 2, height / 2, width / 17, PI / 4, width / 30, width / 500 * SPEED, STARTING_NUMBER_OF_NODES);
  Segments.set_direction(-3 * PI / 4);
}

function keyPressed(){
  if (keyCode === 68) { dir_x = 1 }
  else if (keyCode === 65) dir_x = -1;
  else if (keyCode === 32 && is_game_over) { restart_game(); }
  else if (keyCode === 88 && is_game_over) {
    alert('Account Changed');
  }
}

function keyReleased() {                              
  if (keyCode === 68 || keyCode === 65) dir_x = 0;
}

function touchStarted() {
  if (touches.length == 0) return;
  joystick.set_position(touches[0].x, touches[0].y);
  joystick.moved(touches[0].x, touches[0].y);
}

function touchMoved() {
  if (touches.length == 0) return;
  joystick.moved(touches[0].x, touches[0].y);
}

function touchEnded() {
  joystick.restart();
}

function mousePressed() {
  
  joystick.set_position(mouseX, mouseY);
  joystick.moved(mouseX, mouseY);
}

function mouseDragged() {
  joystick.moved(mouseX, mouseY);
}

function mouseReleased() {
  joystick.restart();
}