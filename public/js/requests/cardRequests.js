async function requestCardsInfo()
{
	try
	{
		const response = await fetch(`/api/cards`);
		return await response.json();
	}
	catch (err)
	{
		// Treat 500 errors here
		console.log(err);
	}
}
