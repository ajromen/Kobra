class Joystick {
    constructor(screen_size, change_direction, allow_if_not_phone = false) {
        this.size = screen_size / 10;
        this.position = createVector(this.size + this.size / 2, screen_size - this.size - this.size / 2);
        this.top = createVector(0, 0);
        this.angle = 0;
        this.started = false;
        this.draw = false;
        this.is_phone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.change_direction = change_direction;
        if(allow_if_not_phone) this.is_phone = true;
    }

    set_position(x, y) {
        this.position.set(x, y);
    }

    moved(x, y) {
        if (!this.is_phone) return;
        this.draw = true;
        if (dist(this.position.x, this.position.y, x, y) <= this.size || this.started) {
            this.angle = atan2(y - this.position.y, x - this.position.x);
            this.top = p5.Vector.sub(this.position, createVector(x, y));
            this.started = true;
            this.change_direction(this.angle);
        } else {
            this.restart();
        }
    }

    restart() {
        this.top.set(0, 0);
        this.started = false;
        this.draw = false;
    }

    display() {
        if (!this.draw || !this.is_phone) return;
        fill(100, 100);
        ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
        fill(0, 150);
        this.top.limit(this.size);
        ellipse(this.position.x - this.top.x, this.position.y - this.top.y, this.size / 4 * 3, this.size / 4 * 3);
    }
}