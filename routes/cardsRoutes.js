const express = require('express');
const router = express.Router();
const cModel = require("../models/cardsModel");

router.get('/', async function (req, res, next)
{
	console.log("Get all cards");
	let result = await cModel.getCards();
	console.log(result);
	res.status(result.status).send(result.result);
});

module.exports = router;
