const WIDTH = 300;
const HEIGHT = 100;
const POSX = 10;
const POSY = 10;

class ScoreBoard
{
	constructor(playerName, opponentName, playerHP, opponentHP, playerState, opponentState, turn, gameover)
	{
		this.pName = playerName;
		this.oName = opponentName;
		this.pHP = playerHP;
		this.oHP = opponentHP;
		this.pState = playerState;
		this.oState = opponentState;
		this.turn = turn;
		this.gameover = gameover;
	}

	getPlayerState()
	{
		return this.pState;
	}

	getOpponentState()
	{
		return this.pState;
	}

	isGameover()
	{
		return this.gameover;
	}

	draw()
	{
		fill(100, 200, 100);
		stroke(0, 0, 0);
		rect(POSX, POSY, WIDTH, HEIGHT, 5, 5, 5, 5);
		fill(0, 0, 0);
		textAlign(LEFT, CENTER);
		text("Turn: " + this.turn, POSX + 10, POSY + HEIGHT / 4);
		text("Player: " + this.pName, POSX + 10, POSY + 2 * HEIGHT / 4);
		text("Opponent: " + this.oName, POSX + 10, POSY + 3 * HEIGHT / 4);
		text("HP: " + this.pHP, POSX + 140, POSY + 2 * HEIGHT / 4);
		text("HP: " + this.oHP, POSX + 140, POSY + 3 * HEIGHT / 4);
		text(`(${this.pState})`, POSX + 200, POSY + 2 * HEIGHT / 4);
		text(`(${this.oState})`, POSX + 200, POSY + 3 * HEIGHT / 4);
		if (this.gameover)
		{
			fill(200, 0, 0);
			textSize(24);
			textStyle(BOLD);
			textAlign(CENTER, CENTER);
			text("GAMEOVER", POSX + 200, POSY - 5 + HEIGHT / 4);
			textSize(16);
			textStyle(NORMAL);
		}
	}

	updateScore(playerHP, opponentHP, playerState, opponentState)
	{
		this.pHP = playerHP;
		this.oHP = opponentHP;
		this.pState = playerState;
		this.oState = opponentState;
	}
}