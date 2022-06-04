const CWIDTH = 150;
const CHEIGHT = 170;

class Card
{
	static images = {};

	constructor(id, card_id, alive, attacked, x, y)
	{
		this.id = id;
		this.card_id = card_id;
		this.x = x;
		this.y = y;
		this.alive = alive;
		this.enabled = true;
		this.attacked = attacked;
		this.selected = false;
	}

	draw()
	{
		if (this.selected)
		{
			fill(100, 200, 100);
		}
		else if (this.attacked)
		{
			fill(200, 100, 100);
		}
		else
		{
			fill(100, 100, 100);
		}
		strokeWeight(3);
		rect(this.x, this.y, CWIDTH, CHEIGHT, 10, 10, 10, 10);
		fill(0, 0, 0);
		stroke(0, 0, 0);
		strokeWeight(1);
		imageMode(CENTER);
		image(Card.images[this.card_id], this.x + CWIDTH / 2, this.y + CHEIGHT / 2, CWIDTH, CHEIGHT);
	}

	getId()
	{
		return this.id;
	}

	hasAttacked()
	{
		return this.attacked;
	}

	getCardAlive()
	{
		return this.alive;
	}
	
	setAttack(hasAttacked)
	{
		this.attacked = hasAttacked;
	}

	enable()
	{
		this.enabled = true;
	}

	disable()
	{
		this.enabled = false;
	}

	isSelected()
	{
		return this.selected;
	}

	deselect()
	{
		this.selected = false;
	}

	clicked(x, y)
	{
		if (this.enabled)
		{
			if (this.x <= x && (this.x + CWIDTH) >= x && this.y <= y && (this.y + CHEIGHT) >= y)
			{
				this.selected = !this.selected;
				return true;
			}
		}
		return false;
	}

}