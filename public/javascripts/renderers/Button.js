const BWIDTH = 120;
const BHEIGHT = 30;

class Button {
    constructor(name, x, y, callback) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.callback = callback;
        this.enabled = true;
        this.visible = true;
        this.pressed = false;
    }
    draw() {
        if (this.visible) {
            if (!this.enabled) {
                fill(150, 150, 150);
            } else if (this.pressed) {
                fill(100, 100, 200);
            } else {
                fill(100, 200, 100);
            }
            rect(this.x, this.y, BWIDTH, BHEIGHT, 2, 2, 2, 2);
            textAlign(CENTER, CENTER);
 
            fill(0, 0, 0);
            if (!this.enabled)  fill(100,100,100);
       
            text(this.name, this.x + BWIDTH / 2, this.y + BHEIGHT / 2);
        }
    }
    setNewFunc(callback,name) {
        this.callback = callback;
        if (name) this.name = name;
    }
    
    isVisible() { return this.visible;}
    show() { this.visible = true;}
    hide() { this.visible = false;}
    
    enable() { this.enabled = true }
    disable() { this.enabled = false }
    
    isEnabled() { return this.enabled; }

    clicked(x, y) {
        if (this.enabled && this.visible) {
            if (this.x <= x && (this.x + BWIDTH) >= x &&
                this.y <= y && (this.y + BHEIGHT) >= y) {
                this.pressed = true;
                setTimeout(()=> {this.pressed = false},200);
                this.callback();
            }
        }
        return false;
    }

}