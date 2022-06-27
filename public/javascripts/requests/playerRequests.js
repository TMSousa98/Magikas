
async function requestAction(pId,pmId,data) {
    try {
        const response = await fetch(`/api/players/${pId}/playermatches/${pmId}/actions`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify(data)
        });
        var result = await response.json();
        // We are not checking for errors (considering the GUI is only allowing correct choices)
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestPlay(pId,pmId,deckId) {
    return await requestAction(pId,pmId, 
        {deckId: deckId, action: "play"});
}        

async function requestAttack(pId,pmId,deckId,opDeckId) {
    return await requestAction(pId,pmId,
                {deckId: deckId, 
                opDeckId: opDeckId, 
                action: "attackCard"});
}        

async function requestAttackPlayer(pId,pmId,deckId) {
    return await requestAction(pId,pmId, 
              {deckId: deckId, action: "attackPlayer"});
}

async function requestEndTurn(pId,pmId) {
    return await requestAction(pId,pmId, 
              {action: "endturn"});
}

async function requestPlayerMatchDeck(pId,pmId) {
    try {
        const response = await fetch(`/api/players/${pId}/playermatches/${pmId}/deck`);
        var result = await response.json();
        // We are not checking for errors (considering id exists)
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestPlayerMatchInfo(id) {
    try {
        const response = await fetch(`/api/players/playermatches/${id}`);
        var result = await response.json();
        // We are not checking for errors (considering id exists)
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestOpponentInfo(pId,pmId, matchId) {
    try {
        const response = await fetch(
            `/api/players/${pId}/matches/${matchId}/playermatches/${pmId}/opponent`);
        var result = await response.json();
        // We are not checking for errors (considering id exists)
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}



async function requestPlayerInfo(id) {
    try {
        const response = await fetch(`/api/players/${id}`);
        var result = await response.json();
        // We are not checking for errors (considering id exists)
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}
