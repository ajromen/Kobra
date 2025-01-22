let joystick, joystick_top
let joystick_size=10;
let joystick_started=false;
let dir_x=0, dir_y=0, joystick_angle=0;
let is_phone=false;
let joystick_draw=false;

/*draw
crtajJoystick()
*/


function joystick_setup(h){
  joystick_size=h/joystick_size;
  joystick= createVector(joystick_size+joystick_size/2,h-joystick_size-joystick_size/2);
  joystick_top = createVector(0,0)
  
  is_phone=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  is_phone=true;
}

function keyPressed(){
    // if (keyCode === 87) { dir_y = 1; }
    // else if (keyCode === 83) dir_y = -1;
    if (keyCode === 68) { dir_x = 1 }
    else if (keyCode === 65) dir_x = -1;
    //if (keyCode === 16) boost=2
}
  
function keyReleased() {                                      
    // if (keyCode === 87 || keyCode === 83) dir_y = 0; 
    if (keyCode === 68 || keyCode === 65) dir_x = 0;
    //if (keyCode === 16) boost=1;
}

function touchMoved(){
    if (is_phone && touches.length > 0) joystick_moved(touches[0].x, touches[0].y);
}

function touchStarted(){
    if (is_phone && touches.length > 0) {
        joystick.set(touches[0].x, touches[0].y);
        joystick_moved(touches[0].x, touches[0].y);
    }
}

function touchEnded(){
    restartMovement()
}

function mousePressed(){
    if(is_phone) {
        joystick.set(mouseX, mouseY);
        joystick_moved(mouseX, mouseY);
    }
}

function mouseDragged(){
    if(is_phone) joystick_moved(mouseX, mouseY);
}

function mouseReleased(){
    if(is_phone) restartMovement()
}

function joystick_moved(){
    joystick_draw=true;
    if(dist(joystick.x,joystick.y,mouseX,mouseY)<=joystick_size || joystick_started){
        let joystick_angle=atan2(mouseY-joystick.y,mouseX-joystick.x)
        // dir_x=sin(joystick_angle+PI/2)
        // dir_y=cos(joystick_angle+PI/2)
        joystick_top=p5.Vector.sub(joystick,createVector(mouseX,mouseY))
        joystick_started=true;
        Segments.change_direction(joystick_angle)
    }
    else{
        restartMovement()
    }
}

function restartMovement(){
    // dir_x=0
    // dir_y=0
    joystick_top.set(0,0)
    joystick_started=false;
    joystick_draw=false;
}

function crtajJoystick(){
    if(!joystick_draw) return;
    fill(100,100)
    ellipse(joystick.x,joystick.y,joystick_size*2,joystick_size*2)
    fill(0,150)
    joystick_top.limit(joystick_size)
    ellipse(joystick.x - joystick_top.x, joystick.y - joystick_top.y, joystick_size/4*3, joystick_size/4*3);
}