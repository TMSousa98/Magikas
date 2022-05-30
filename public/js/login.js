async function login()
{
	try
	{
		let name = document.getElementById("name").value;
		let pass = document.getElementById("password").value;
		let player = await requestLogin(name, pass);
		if (!player.ply_id)
		{
			alert(player.msg);
		}
		else
		{
			sessionStorage.setItem("playerId", player.ply_id);
			let matches = await requestPlayerMatches(player.ply_id);
			if (matches.length == 0)
			{
				window.location = "matches.html";
			}
			else
			{
				// get first match (the only one in current match rules)
				let pmatch = matches[0];
				let omatch = await requestOpponentInfo(player.ply_id, pmatch.pm_id, pmatch.pm_match_id);
				sessionStorage.setItem("pId", pmatch.pm_id);
				sessionStorage.setItem("mId", pmatch.pm_match_id);
				if (omatch.pm_id)
				{
					sessionStorage.setItem("oId", omatch.pm_id);
					window.location = "game.html";
				}
				else
				{
					window.location = "waiting.html";
				}
			}
		}
	}
	catch (err)
	{
		console.log(err);
	}
}