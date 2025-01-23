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
    super(x,y,radius/1.5,angle)
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
    if(this.x>width||this.x<0||this.y>height||this.y<0)
      game_over();
  }
}

class SegmentList{
  constructor(start_x,start_y,main_radius,start_angle,node_distance,node_speed,number_of_nodes=2){
    this.number_of_nodes=number_of_nodes;
    this.recalculate_scaling_factor();
    this.main_radius=main_radius;
    this.node_distance=node_distance;
    this.node_speed=node_speed;
    
    this.head = new Head(start_x,start_y,main_radius,start_angle,null,null);
    this.tail=this.head;
    
    while(number_of_nodes--) this.add_back_bulk();
    this.recalculate_radiuses();
  }

  add_back_bulk(){
    let angle = this.tail.angle;
    let next_loc = this.point_from_angle(this.tail.x, this.tail.y, this.node_distance, angle);
    let next_node = new Segment(next_loc.x, next_loc.y, this.main_radius, angle, this.tail, null);
    this.tail.next = next_node;
    this.tail = next_node;
  }
  
  add_back(angle=null){
    if (angle == null) {
      angle = this.tail.angle;
    }
    let next_loc = this.point_from_angle(this.tail.x, this.tail.y, this.node_distance, angle);
    let next_node = new Segment(next_loc.x, next_loc.y, this.main_radius, angle, this.tail, null);
    this.tail.next = next_node;
    this.tail = next_node;
    this.number_of_nodes++;
    this.recalculate_radiuses();
  }

  recalculate_scaling_factor(){
    let mapiraj=map(this.number_of_nodes, 0, 150, 45, 15)
    this.scaling_factor = this.number_of_nodes / mapiraj;
  }

  recalculate_radiuses(){
    this.recalculate_scaling_factor();

    //kobriranje
    let curr = this.head.next;
    curr.radius= this.main_radius*1.2;
    curr = curr.next;
    curr.radius= this.main_radius*1.7;
    curr=curr.next;
    curr.radius= this.main_radius*1.2;
    curr=curr.next;

    let index = 0;
    while (curr != null) {
      curr.radius = this.bellcurve_radius(index);
      curr = curr.next;
      index++;
    }
  }

  bellcurve_radius(index){
    let a=this.scaling_factor;
    let pow=-((index-7*a)**2/(1000*a));
    let radius=this.main_radius*exp(pow);
    return radius;
  }
  
  point_from_angle(x,y,d,angle){
    let x1=x+d*cos(angle)
    let y1=y+d*sin(angle)
    return createVector(x1,y1)
  }

  set_direction(angle){
    this.head.angle = angle;
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
    this.head.angle+=direction*PI/70*SPEED
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

  check_collision(fruit){
    fruit.forEach(fruit => {
      if(dist(this.head.x,this.head.y,fruit.x,fruit.y)<this.main_radius+fruit.radius){
        fruit.x=random(width);
        fruit.y=random(height);
        this.add_back();
        score++;
      }
    });
  }
}

function normalise_angle(angle){
  while(angle>PI) angle-=2*PI;
  while(angle<-PI) angle+=2*PI;
  return angle;
}