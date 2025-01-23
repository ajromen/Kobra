class Segment{
  constructor(x,y,radius,angle,prev=null,next=null){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.angle=angle;
    this.prev=prev;
    this.next=next;
  }
  display(){
    circle(this.x,this.y,this.radius)
  }
  pull(distance){
    if(this.next){
      let wanted_angle = atan2(this.y - this.next.y, this.x - this.next.x);
      wanted_angle = normalise_angle(wanted_angle);
      this.angle = normalise_angle(this.angle);
      let angle_diff = normalise_angle(this.angle - wanted_angle);
      if(angle_diff > PI/4){
        wanted_angle = this.angle - PI/4;
      }
      if(angle_diff < -PI/4){
        wanted_angle = this.angle + PI/4;
      }
      let dir = createVector(cos(wanted_angle), sin(wanted_angle));
      dir.setMag(distance);
      this.next.angle = wanted_angle;
      this.next.x = this.x - dir.x;
      this.next.y = this.y - dir.y;
    }
  }
}

class Head extends Segment{
  constructor(x,y,radius,angle){
    super(x,y,radius,angle)
  }
  display(){
    fill(200,100,24)
    circle(this.x,this.y,this.radius)
    noFill()
  }
  follow(node_speed){
    let dir = createVector(cos(this.angle),sin(this.angle));
    dir.setMag(node_speed);
    this.x += dir.x;
    this.y += dir.y;
  }
}

class SegmentList{
  constructor(start_x,start_y,main_radius,start_angle,node_distance,node_speed,number_of_nodes=2){
    this.number_of_nodes=number_of_nodes;
    this.main_radius=main_radius;
    this.node_distance=node_distance;
    this.node_speed=node_speed;
    
    this.head = new Head(start_x,start_y,main_radius,start_angle,null,null);
    this.tail=this.head;
    this.head.angle=-start_angle;
    
    while(number_of_nodes--) this.add_back();
  }
  
  add_back(angle=null){
    if (angle == null) {
      angle = this.tail.angle;
    }
    let next_loc = this.point_from_angle(this.tail.x, this.tail.y, this.node_distance, angle);
    let next_node = new Segment(next_loc.x, next_loc.y, this.main_radius, angle, this.tail, null);
    this.tail.next = next_node;
    this.tail = next_node;
  }
  
  point_from_angle(x,y,d,angle){
    let x1=x+d*cos(angle)
    let y1=y+d*sin(angle)
    return createVector(x1,y1)
  }

  change_direction(angle){
    let angle_diff=normalise_angle(this.head.angle-angle);
    if(angle_diff > PI/50*SPEED){
      angle = this.head.angle - PI/50*SPEED;
    }
    if(angle_diff < -PI/50*SPEED){
      angle = this.head.angle + PI/50*SPEED;
    }
    this.head.angle = angle;
  }

  turn(direction){
    this.head.angle+=direction*PI/50*SPEED
  }
  
  display(){
    let curr = this.head;
    while (curr != null) {
      curr.display();
      curr = curr.next;
    }
  }

  move(){
    let curr = this.head;
    curr.follow(this.node_speed)
    while (curr != null) {
      curr.pull(this.node_distance);
      curr = curr.next;
    }
  }
}

function normalise_angle(angle){
  while(angle>PI) angle-=2*PI;
  while(angle<-PI) angle+=2*PI;
  return angle;
}