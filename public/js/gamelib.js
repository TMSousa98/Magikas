const width = 1000;
const height = 700;

let playerId;
let scoreBoard;

const CARDSPACE = 110;
let hand = [];
const HANDX = 50;
const HANDY = 500;
let table = [];
const TABLEX = 400;
const TABLEY = 350;
let opponent = [];
const OPX = 400;
const OPY = 20;

const slot1 = new Slot(TABLEX, TABLEY);
const slot2 = new Slot(TABLEX + CARDSPACE, TABLEY);
const slot3 = new Slot(TABLEX + CARDSPACE * 2, TABLEY);
const slot4 = new Slot(TABLEX + CARDSPACE * 3, TABLEY);
const slot5 = new Slot(TABLEX + CARDSPACE * 4, TABLEY);

const opslot1 = new Slot(OPX, OPY);
const opslot2 = new Slot(OPX + CARDSPACE, OPY);
const opslot3 = new Slot(OPX + CARDSPACE * 2, OPY);
const opslot4 = new Slot(OPX + CARDSPACE * 3, OPY);
const opslot5 = new Slot(OPX + CARDSPACE * 4, OPY);
const slots = [slot1,slot2,slot3,slot4, slot5, opslot1, opslot2, opslot3, opslot4, opslot5];

const attackButton = new Button("Attack", 500, 650, attack);
const playButton = new Button("Play Card", 150, 650, play);
const endTurnButton = new Button("End Turn", 850, 650, end);
const buttons = [attackButton, playButton, endTurnButton];

let startingTurn = false;

async function refresh()
{
	if (scoreBoard && (scoreBoard.getPlayerState() == "Wait" || scoreBoard.getPlayerState() == "Endturn"))
	{
		await loadScoreBoard();
		await loadCards();
		setCardsState();
		startingTurn = true;
	}
	else
	{
		if (startingTurn)
		{
			await loadScoreBoard();
			await loadCards();
			setCardsState();
			refreshButtons();
			startingTurn = false;
		}
	}
}

async function play()
{
	let card = returnSelected(hand);
	await requestPlay(playerId, playerMatchId, card.getId());
	await loadScoreBoard();
	await loadCards();
	setCardsState();
	refreshButtons();
}

async function attack()
{
	let card = returnSelected(table);
	let ocard = returnSelected(opponent);
	await requestAttack(playerId, playerMatchId, card.getId(), ocard.getId());
	await loadCards();
	setCardsState();
	refreshButtons();
}

async function attackPlayer()
{
	let card = returnSelected(table);
	await requestAttackPlayer(playerId, playerMatchId, card.getId());
	await loadCards();
	await loadScoreBoard();
	setCardsState();
	refreshButtons();
}

async function end()
{
	await requestEndTurn(playerId, playerMatchId);
	await loadCards();
	await loadScoreBoard();
	setCardsState();
	refreshButtons();
}

async function removeCard() 
{
	for (let card in hand)
	{
		if (card.getCardAlive() == false) 
		{
			await requestRemoveCard(playerId, playerMatchId, card.getId());
			await loadCards();
			setCardsState();
			refreshButtons();
		}
	}
}

function preload()
{

}

async function loadScoreBoard()
{
	let p1 = await requestPlayerMatchInfo(playerMatchId);
	let p2 = await requestPlayerMatchInfo(opponentMatchId);
	playerId = p1.ply_id;
	scoreBoard = new ScoreBoard(p1.ply_name, p2.ply_name, p1.pm_hp, p2.pm_hp, p1.pms_name, p2.pms_name, p1.mt_turn, p1.mt_finished);
}

async function setup()
{
	noLoop();
	let canvas = createCanvas(width, height);
	canvas.parent('game');
	background(0);
	// preload card images
	let cards = await requestCardsInfo();
	for (let card of cards)
	{
		Card.images[card.crd_id] = await loadImage('./assets/' + card.crd_name + '.png');
	}
	// if I had the url of the images on the database it would be even easier (and it is more correct)
	// cardImgs[card.crd_id] = await loadImage(card.crd_url);   
	
	await loadScoreBoard();
	await loadCards();
	setCardsState();
	refreshButtons();
	setInterval(refresh, 1000);
	loop();
}




function refreshButtons()
{
	for (let button of buttons)
	{
		button.hide();
		button.disable();
	}
	if (scoreBoard.isGameover())
	{
		return;
	}

	if (scoreBoard.getPlayerState() === "PlayCard")
	{
		playButton.show();
		if (returnSelected(hand))
		{
			playButton.enable();
		}
	}
	else if (scoreBoard.getPlayerState() === "Attack")
	{
		attackButton.show();
		endTurnButton.show();
		endTurnButton.enable();
		let countAlive = 0;
		for (let card of opponent)
		{
			// if opponent has a card alive
			if (card.getCardAlive() == true)
			{
				countAlive++;
			}
		}
		if (countAlive == 0)
		{
			attackButton.setNewFunc(attackPlayer, "Attack Player");
			if (returnSelected(table))
			{
				attackButton.enable();
			}
		}
		else
		{
			attackButton.setNewFunc(attack, "Attack");
			if (returnSelected(table) && returnSelected(opponent))
			{
				attackButton.enable();
			}
		}
	}
}

function setCardsState()
{
	for (let card of hand)
	{
		card.disable();
	}
	for (let card of table)
	{
		card.disable();
	}
	for (let card of opponent)
	{
		card.disable();
	}
	if (scoreBoard.isGameover())
	{
		return;
	}

	if (scoreBoard.getPlayerState() === "PlayCard")
	{
		for (let card of hand)
		{
			card.enable();
		}
	}
	else if (scoreBoard.getPlayerState() === "Attack")
	{
		for (let card of table)
		{
			if (!card.hasAttacked())
			{
				card.enable();
			}
		}
		if (returnSelected(table))
		{
			for (let card of opponent)
			{
				// if opponent has a card alive
				if (card.getCardAlive() == true)
				{
					card.enable();
				}
			}
		}
	}
}

async function loadCards()
{
	let myCards = await requestPlayerMatchDeck(playerId, playerMatchId);
	let opCards = await requestPlayerMatchDeck(playerId, opponentMatchId);
	let handPos = 0;
	hand = [];
	let tablePos = 0;
	table = [];
	let opPos = 0;
	opponent = [];
	for (let card of myCards)
	{
		
		if (card.cp_name === "Hand")
		{
			hand.push(new Card(card.deck_id, card.deck_card_id, card.crd_name, true, false,HANDX + CARDSPACE * handPos, HANDY));
			handPos++;
		}
		else
		{
			// Limit the number of cards played in the table to 5
			if(table.length < 5)
			{
				table.push(new Card(card.deck_id, card.deck_card_id, card.crd_name, true, card.cp_name === "TablePlayed",TABLEX + CARDSPACE * tablePos, TABLEY));
				tablePos++;
			}
		}
	}
	for (let card of opCards)
	{
		// Limit the number of cards played in the table to 5
		if (opponent.length < 5) 
		{
			opponent.push(new Card(card.deck_id, card.deck_card_id, card.crd_name, true, card.cp_name === "TablePlayed",OPX + CARDSPACE * opPos, OPY));
			opPos++;
		}
	}
}

function draw()
{
	background(220);
	scoreBoard.draw();
	
	// draw the slots
	for (let slot of slots) 
	{
		slot.draw();
	}
	for (let card of table)
	{
		card.draw();
	}
	for (let card of hand)
	{
		card.draw();
	}
	for (let card of opponent)
	{
		card.draw();
	}
	for (let button of buttons)
	{
		button.draw();
	}
}

function mouseClicked()
{
	let card;

	card = returnSelected(table);
	if (card)
	{
		// if we deselect a table card we deselect the opponent card also
		if (card.clicked(mouseX, mouseY))
		{
			for (let card of opponent)
			{
				card.deselect();
			}
		}
	}
	else
	{
		for (let card of table)
		{
			card.clicked(mouseX, mouseY);
		}
	}


	card = returnSelected(hand);
	if (card)
	{
		card.clicked(mouseX, mouseY);
	}
	else
	{
		for (let card of hand)
		{
			card.clicked(mouseX, mouseY);
		}
	}

	card = returnSelected(opponent);
	if (card)
	{
		card.clicked(mouseX, mouseY);
	}
	else
	{
		for (let card of opponent)
		{
			card.clicked(mouseX, mouseY);
		}
	}

	setCardsState();
	refreshButtons();

	for (let button of buttons)
	{
		button.clicked(mouseX, mouseY);
	}
}

function returnSelected(cardList)
{
	for (let card of cardList)
	{
		if (card.isSelected())
		{
			return card;
		}
	}
	return null;
}
