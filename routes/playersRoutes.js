const express = require('express');
const router = express.Router();
const pModel = require("../models/playersModel");

router.post('/:pId/playermatches/:pmId/actions', async function (req, res, next)
{
	let pId = req.params.pId;
	let pmId = req.params.pmId;
	let action = req.body.action;
	console.log("Player action: " + action);
	let resMatch = await pModel.getMatchOfPlayer(pmId);
	if (resMatch.status != 200)
	{
		res.status(result.status).send(result.result);
	}
    else if (resMatch.result.mt_finished)
	{
		res.status(423).send({msg: "That match has already finished"});
	}
    else if (action == "endturn")
	{
		let result = await pModel.endTurn(pmId);
		res.status(result.status).send(result.result);
	}
	else if (action == "attackCard")
	{
		let dId = req.body.deckId;
		let opDId = req.body.opDeckId;
		let result = await pModel.attackCard(pmId, dId, opDId);
		res.status(result.status).send(result.result);
	}
	else if (action == "play")
	{
		let dId = req.body.deckId;
		let result = await pModel.playCardFromHand(pmId, dId);
		res.status(result.status).send(result.result);
	}
	else
	{
		res.status(400).send({msg: "Invalid action"});
	}
});

router.get('/:pId/playermatches/:pmId/deck', async function (req, res, next)
{
	console.log("Get deck for player in a match");
	let pId = req.params.pId;
	let pmId = req.params.pmId;
	let result = await pModel.getPlayerDeck(pId, pmId);
	res.status(result.status).send(result.result);
});

router.get('/playermatches/waiting', async function (req, res, next)
{
	console.log("Get player and matches info that are waiting for others");
	let result = await pModel.getPlayersAndMatchesWaiting();
	res.status(result.status).send(result.result);
});

router.get('/playermatches/:id', async function (req, res, next)
{
	console.log("Get match info for player");
	let pmId = req.params.id;
	let result = await pModel.getPlayerMatchInfo(pmId);
	res.status(result.status).send(result.result);
});

router.post('/', async function (req, res, next)
{
	console.log("Register player");
	let username = req.body.username;
	let password = req.body.password;
	let result = await pModel.register(username, password);
	res.status(result.status).send(result.result);
});

router.post('/:id/matches', async function (req, res, next)
{
	console.log("Create a new match for player");
	let pId = req.params.id;
	let result = await pModel.createMatch(pId);
	res.status(result.status).send(result.result);
});

router.put('/matches/:mId', async function (req, res, next)
{
	console.log("Join a match");
	let pId = req.body.pId;
	let mId = req.params.mId;
	let result = await pModel.joinMatch(pId, mId);
	res.status(result.status).send(result.result);
});

// filter by match
router.get('/playermatches/match/:mId', async function (req, res, next)
{
	console.log("Get players in a match");
	let mId = req.params.mId;
	let result = await pModel.getPlayersOfMatch(mId);
	res.status(result.status).send(result.result);
});

router.post('/login', async function (req, res, next)
{
	console.log("Login player ");
	let username = req.body.username;
	let password = req.body.password;
	let result = await pModel.login(username, password);
	res.status(result.status).send(result.result);
});

router.get('/:pId/playermatches', async function (req, res, next)
{
	console.log("Get player matches");
	let pId = req.params.pId;
	let result = await pModel.getPlayerActiveMatches(pId);
	res.status(result.status).send(result.result);
});

router.get('/:id', async function (req, res, next)
{
	console.log("Get playerinfo");
	let pId = req.params.id;
	let result = await pModel.getPlayerInfo(pId);
	res.status(result.status).send(result.result);
});

router.get('/:pId/matches/:mId/playermatches/:pmId/opponent', async function (req, res, next)
{
	console.log("Get player match opponent");
	let pId = req.params.pId;
	let pmId = req.params.pmId;
	let mId = req.params.mId;
	let result = await pModel.getOpponent(pmId, mId);
	res.status(result.status).send(result.result);
});

module.exports = router;
