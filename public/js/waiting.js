setInterval(checkOpponent, 1000);

async function checkOpponent()
{
	try
	{
		let playerId = sessionStorage.getItem("playerId");
		let pId = sessionStorage.getItem("pId");
		let mId = sessionStorage.getItem("mId");
		let opponent = await requestOpponentInfo(playerId, pId, mId);
		if (opponent.pm_id)
		{
			sessionStorage.setItem("oId", opponent.pm_id);
			window.location = "game.html";
		}
	}
	catch (err)
	{
		console.log(err);
	}
}