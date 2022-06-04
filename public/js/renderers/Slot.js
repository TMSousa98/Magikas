const SWIDTH = 150;
const SHEIGHT = 170;

class Slot 
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	draw() 
	{
		fill(0);
		rect(this.x, this.y, SWIDTH, SHEIGHT, 10, 10, 10, 10);
		fill(255);
		textStyle(BOLD);
		textSize(12);
		textAlign(CENTER, CENTER);
		text("Empty Slot", this.x + SWIDTH / 2, this.y + SHEIGHT / 2);
	}
}