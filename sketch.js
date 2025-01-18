const START_LENGTH=6
let HEAD_LENGTH=3
let SPEED=2
let Segments;


function setup() {
  let h = windowWidth > windowHeight ? windowHeight : windowWidth;
  createCanvas(h, h);
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  select('canvas').style('position', 'absolute').style('top', canvasY + 'px').style('left', canvasX + 'px');
  
  let radius=h/17;
  let segment_distance=h/30;
  let node_speed=h/500*SPEED;
  
  Segments=new SegmentList(h/2,h/2,radius,PI/4,segment_distance,node_speed,15);

  joystick_setup(h);

  noFill()
}

function draw() {
  background(220);
  
  if (dir_x !== 0) {
    Segments.turn(dir_x);
  }
  
  Segments.move();
  Segments.display();
  if(is_phone) crtajJoystick();
}