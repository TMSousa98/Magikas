async function requestAction(pId, pmId, data)
{
	try
	{
		const response = await fetch(`/api/players/${pId}/playermatches/${pmId}/actions`,
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: JSON.stringify(data)
			});
		// We are not checking for errors (considering the GUI is only allowing correct choices)
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}

async function requestPlay(pId, pmId, deckId)
{
	return await requestAction(pId, pmId,
		{
			deckId: deckId, 
			action: "play"
		});
}

async function requestAttack(pId, pmId, deckId, opDeckId)
{
	return await requestAction(pId, pmId,
		{
			deckId: deckId,
			opDeckId: opDeckId,
			action: "attackCard"
		});
}

async function requestEndTurn(pId, pmId)
{
	return await requestAction(pId, pmId,
		{
			action: "endturn"
		});
}

async function requestRemoveCard(pId, pmId, deckId)
{
	return await requestAction(pId, pmId,
		{
			deckId: deckId, 
			action: "removeCard"
		});
}

async function requestPlayerMatchDeck(pId, pmId)
{
	try
	{
		const response = await fetch(`/api/players/${pId}/playermatches/${pmId}/deck`);
		// We are not checking for errors (considering id exists)
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}

async function requestPlayerMatchInfo(id)
{
	try
	{
		const response = await fetch(`/api/players/playermatches/${id}`);
		// We are not checking for errors (considering id exists)
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}

async function requestOpponentInfo(pId, pmId, matchId)
{
	try
	{
		const response = await fetch(`/api/players/${pId}/matches/${matchId}/playermatches/${pmId}/opponent`);
		// We are not checking for errors (considering id exists)
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}


async function requestPlayerInfo(id)
{
	try
	{
		const response = await fetch(`/api/players/${id}`);
		// We are not checking for errors (considering id exists)
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}
