let pId;

window.onload = async function() {
    pId = sessionStorage.getItem("playerId");
    try {
        let matches = await requestWaitingMatches();
        let html = "";
        for (let match of matches) {
            html+= `<section onclick="join(${match.mt_id})">
                        <p> Join ${match.ply_name} </p>
                    </section>`
        }
        document.getElementById("matches").innerHTML = html;
    } catch (err) {
        console.log(err);
    }
}

async function join(mId) {
    try {
        let res = await requestJoinMatch(pId,mId);
        sessionStorage.setItem("pId",res.pmId);
        sessionStorage.setItem("oId",res.oId);
        sessionStorage.setItem("mId",mId);
        window.location="game.html"
    } catch (err) {
        console.log(err);
    }
}

async function createMatch() {
    try {
        let res = await requestCreateMatch(pId);
        sessionStorage.setItem("pId",res.pmId);
        sessionStorage.setItem("mId",res.matchId);
        window.location="waiting.html"
    } catch (err) {
        console.log(err);
    }  
}