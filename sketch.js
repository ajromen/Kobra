const START_LENGTH=6
let HEAD_LENGTH=3
let STARTING_NUMBER_OF_NODES=50
let SPEED=3
let Segments;
let joystick;
let dir_x = 0;

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

  joystick = new Joystick(h, (angle) => Segments.change_direction(angle),true);
  stroke(255)
  noFill()
}

function draw() {
  background(0);
  
  if (dir_x !== 0) {
    Segments.turn(dir_x);
  }
  
  Segments.move();
  Segments.display();
  joystick.display();
}

function keyPressed(){
  if (keyCode === 68) { dir_x = 1 }
  else if (keyCode === 65) dir_x = -1;
}

function keyReleased() {                              
  if (keyCode === 68 || keyCode === 65) dir_x = 0;
}

function touchMoved() {
  if (touches.length == 0) return;
  joystick.moved(touches[0].x, touches[0].y);
}

function touchStarted() {
  if (touches.length == 0) return;
  joystick.set_position(touches[0].x, touches[0].y);
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