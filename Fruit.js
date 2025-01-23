class Fruit{
    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    display() {
        circle(this.x,this.y,this.radius)
    }
}