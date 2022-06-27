var pool = require('./connection.js')

module.exports.getPlayersOfMatch = async function (mId) {
    try {
        let sqlCheck = `select * from playermatch
                        where pm_match_id = $1`;
        let resCheck = await pool.query(sqlCheck, [mId]);
        return { status: 200, result: resCheck.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getMatchOfPlayer = async function (pmId) {
    try {
        let sqlCheck = `select * from match,playermatch
    where pm_id = $1 and pm_match_id = mt_id`;
        let resCheck = await pool.query(sqlCheck, [pmId]);
        if (resCheck.rows.length == 0)
            return { status: 400, result: { msg: "That player is not on a match" } };
        return { status: 200, result: resCheck.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getPlayerMatch = async function (pmId) {
    try {
        let sqlCheck = `select * from playermatch
    where pm_id = $1`;
        let resCheck = await pool.query(sqlCheck, [pmId]);
        if (resCheck.rows.length == 0)
            return { status: 400, result: { msg: "That player does not exist" } };
        return { status: 200, result: resCheck.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.getPlayerDeckCard = async function (pmId, deckId, ownerName) {
    if (!ownerName) ownerName = "player";
    try {

        let sqlCheckDeck = `select * from deck 
            where deck_id = $1
            and deck_pm_id = $2`;
        let resCheckDeck = await pool.query(sqlCheckDeck, [deckId, pmId]);
        if (resCheckDeck.rows.length == 0)
            return { status: 400, result: { msg: "Card not owned by the "+ownerName } };
        return {status: 200, result: resCheckDeck.rows[0]};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getOpponent = async function (pmId, matchId) {
    try {
        let sqlCheckOp = `select * from playermatch 
                          where pm_match_id = $1
                          and pm_id != $2`;
        let resCheckOp = await pool.query(sqlCheckOp, [matchId, pmId]);
        if (resCheckOp.rows.length == 0)  
            return { status: 400, result: { msg: "That match is missing an opponent" } };
        return { status:200, result:resCheckOp.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.attackPlayer = async function (pmId, deckId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        
        let player = res.result;
        if (player.pm_state_id != 2)
            return { status: 400, result: { msg: "You cannot attach at this moment" } };
        
        // get player deck card info
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.deck_pos_id != 2)
            return { status: 400, result: { msg: "The card cannot attack at this moment" } };
        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        let opPmId = opponent.pm_id;
        // check if opponent deck as no "living" cards
        let sqlCheckOpDeck = `select * from deck 
                             where deck_pm_id = $1
                             and (deck_pos_id = 2 or deck_pos_id = 3) 
                             and deck_card_hp > 0`;
        let resCheckOpDeck = await pool.query(sqlCheckOpDeck, [opPmId]);
        if (resCheckOpDeck.rows.length != 0)
            return {status: 400, result: {msg: "Cannot attack opponent, some cards still have HP left"}}; 
        // Mark the card has "TablePlayed"
        let sqlUpPos = `update deck set deck_pos_id = 3
                        where deck_id = $1`
        await pool.query(sqlUpPos, [deckId]);
        // remove 1 from opponent life
        let sqlUpHp = `update playermatch set pm_hp = pm_hp - 1
                        where pm_id = $1`
        await pool.query(sqlUpHp, [opPmId]);
        return {status:200, result: {msg: "Successfully removed 1 HP from the opponent "}}
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }

}

module.exports.endTurn = async function (pmId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id != 2)
            return { status: 400, result: { msg: "You cannot end turn at this moment" } };

        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        
        // reset attack of the player cards on the table
        let sqlDeck = `update deck set deck_pos_id = 2 
                       where deck_pos_id = 3 and deck_pm_id = $1`;
        await pool.query(sqlDeck, [pmId]);

        // Set player match states
        let sqlUpState = `update playermatch set pm_state_id = $1 
                          where pm_id = $2`;
        // the opponent has not yet played
        if (opponent.pm_state_id == 4) {
            // change state of player to EndTurn
            await pool.query(sqlUpState, [3, pmId]);
            // change state of opponent to PlayCard
            await pool.query(sqlUpState, [1, opponent.pm_id]);
        } else if (opponent.pm_state_id == 3) { // if both have ended the turn 
                
            // Check for end game condition
            if (opponent.pm_hp <= 0 || player.pm_hp <= 0) {
                let sqlEnd = `Update match set mt_finished = true
                            Where mt_id = $1`;
                await pool.query(sqlEnd, [matchId]);
                return { status: 200, result: { msg: "Game Ended" } };
            } else {
                // increment turn count
                let sqlTurn = `update match set mt_turn = mt_turn + 1   
                               where mt_id = $1`;
                await pool.query(sqlTurn, [matchId]);
                // delete all cards that died from both players in the match
                // Cards on the hand have full HP so no need to check the card position
                let sqlDeck = `delete from deck 
                           where (deck_pm_id = $1 or deck_pm_id = $2)  
                           and deck_card_hp <= 0`;
                await pool.query(sqlDeck, [pmId, opponent.pm_id]);
                // change state of player to Wait (opponent will go first this time)
                await pool.query(sqlUpState, [4, pmId]);
                // change state of opponent to PlayCard
                await pool.query(sqlUpState, [1, opponent.pm_id]);
            } 
        } else {
            return { status: 500, result: { msg: "Current state of the players in the match is not valid" } }
        }
     
        // get a new card for the next player playing (the opponent)
        // get random card value
        this.createRandomCards(opponent.pm_id,1);
        
        return { status: 200, result: { msg: "Turn ended" } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.playCardFromHand = async function (pmId, deckId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id != 1)
            return { status: 400, result: { msg: "You cannot play a new card at this moment" } };

        // if card exists on players hand, change it to the table
        let sql = `update deck set deck_pos_id = 3 
                   where deck_id = $1 and deck_pm_id = $2 
                   and deck_pos_id = 1 `;
        let result = await pool.query(sql, [deckId, pmId]);
        if (result.rowCount > 0) {
            let sqlNext = `update playermatch set pm_state_id = 2 
                   where pm_id = $1`;
            await pool.query(sqlNext, [pmId]);
            return { status: 200, result: { msg: "Card played" } };
        } else { // if not, give an error
            return { status: 400, result: { msg: "That card is not on the players hand" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.attackCard = async function (pmId, deckId, opDeckId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id != 2)
            return { status: 400, result: { msg: "You cannot attach at this moment" } };
        // get player deck card info
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.deck_pos_id != 2)
            return { status: 400, result: { msg: "The card cannot attack at this moment" } };
        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        let opPmId = opponent.pm_id;
        
        res = await this.getPlayerDeckCard(opPmId, opDeckId,"opponent");
        if (res.status != 200) return res;
        let opCard = res.result;     
        if ((opCard.deck_pos_id != 2 && opCard.deck_pos_id != 3) || opCard.deck_hp <= 0)
            return { status: 400, result: { msg: "You can only attack cards on the table with HP higher or equal to zero." } };

        // Now everything is ok. Lets make the attack
        // Mark the card has "TablePlayed"
        let sqlUpPos = `update deck set deck_pos_id = 3
                        where deck_id = $1`
        await pool.query(sqlUpPos, [deckId]);

        let sqlBattle = `select * from cardwcard 
                      where cwc_cwins_id = $1 and cwc_clooses_id = $2`
        let resWin = await pool.query(sqlBattle, [card.deck_card_id, opCard.deck_card_id]);
        if (resWin.rows.length > 0) {
            let sqlWin = `update deck set deck_card_hp = deck_card_hp - 2
                          where deck_id = $1`
            await pool.query(sqlWin, [opDeckId]);
            return { status: 200, result: { msg: "Attack made 2 damage (element advantage)" } };
        } else {
            let resLoose = await pool.query(sqlBattle, [opCard.deck_card_id, card.deck_card_id]);
            if (resLoose.rows.length > 0) {
                let sqlLoose = `update deck set deck_card_hp = deck_card_hp - 1
                              where deck_id = $1;`
                await pool.query(sqlLoose, [opDeckId]); // opponent
                await pool.query(sqlLoose, [deckId]);  // player
                return { status: 200, result: { msg: "Attack made 1 damage but received 1 damage (element disavantage)" } };
            } else { // tie
                let sqlTie = `update deck set deck_card_hp = deck_card_hp - 1
                              where deck_id = $1`
                await pool.query(sqlTie, [opDeckId]);
                return { status: 200, result: { msg: "Attack made 1 damage (element tie)" } };
            }
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}



module.exports.getPlayerDeck = async function (pId, pmId) {
    try {
        let sqlCheck = `select * from playermatch where pm_player_id = $1 and pm_id = $2`;
        let resultCheck = await pool.query(sqlCheck, [pId, pmId]);
        if (resultCheck.rows.length > 0) { // I'm the owner of the deck
            let sql = `select deck_id, deck_pm_id, deck_pos_id, deck_card_id, deck_card_hp,
            cp_name, crd_name, crd_description
            from deck, cardpos, card 
            where deck_pm_id = $1 and
                deck_pos_id = cp_id and
                deck_card_id = crd_id`;
            let result = await pool.query(sql, [pmId]);
            let cards = result.rows;
            return { status: 200, result: cards };
        }
        let sqlCheckOp = `
            select * from playermatch 
            where pm_player_id = $1 and pm_match_id IN
                (select pm_match_id from playermatch where pm_id = $2)`;
        let resultCheckOp = await pool.query(sqlCheckOp, [pId, pmId]);

        if (resultCheckOp.rows.length > 0) {
            let sql = `select deck_id, deck_pm_id, deck_pos_id, deck_card_id, deck_card_hp,
            cp_name, crd_name, crd_description
            from deck, cardpos, card 
            where deck_pm_id = $1 and
                deck_pos_id = cp_id and
                deck_card_id = crd_id and
                (cp_name LIKE 'Table' or  cp_name LIKE 'TablePlayed')  `;
            let result = await pool.query(sql, [pmId]);
            let cards = result.rows;
            return { status: 200, result: cards };
        }
        return { status: 401, result: { msg: "You are not playing in this match" } };

    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}




module.exports.getPlayerMatchInfo = async function (pmId) {
    try {
        let sql = `	select pm_id, pm_state_id, pm_hp, pms_name, mt_turn, mt_finished, ply_name, ply_id  
        from  playermatch, pmstate, match, player  
        where 
          pm_player_id = ply_id and
          pm_state_id = pms_id and
          pm_match_id = mt_id and
          pm_id = $1`;
        let result = await pool.query(sql, [pmId]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 404, result: { msg: "No playermatch with that id" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getPlayerInfo = async function (playerId) {
    try {
        let sql = `Select ply_name from player where ply_id = $1`;
        let result = await pool.query(sql, [playerId]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 404, result: { msg: "No player with that id" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.login = async function (username,password) {
    try {
        let sql = `Select ply_name,ply_id from player 
        where ply_name = $1 and ply_passwd = $2`;
        let result = await pool.query(sql, [username,password]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 401, result: { msg: "Wrong username/password" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.register = async function (username,password) {
    try {
        if (password.length < 8 || username < 4) 
            return { status: 400, 
                result: {msg: "Username must have at least 4 characters and password at least 8"} };
    
        let sql = `Select ply_name from player 
                   where ply_name = $1`;
        let result = await pool.query(sql, [username]);
        if (result.rows.length > 0) 
            return { status: 400, result: {msg: "That player name is already in use."} };
        
        sql = `Insert into player(ply_name,ply_passwd) values($1,$2)`;
        await pool.query(sql, [username,password]);
        return { status: 200, result: { msg: "Player created" } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.getPlayersAndMatchesWaiting =  async function (pId) {
    try {
        let sql = `select mt_id, pm_id, ply_name from playermatch,match, player
                   where pm_match_id = mt_id and mt_finished = false and
                   ply_id = pm_player_id and
                   (select count(*) from playermatch where pm_match_id = mt_id) = 1`
        let res = await pool.query(sql);
        return {status:200, result: res.rows};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }

}

module.exports.getPlayerActiveMatches = async function (pId) {
    try {
        let sql = `Select * from playermatch, match 
                    where pm_match_id = mt_id 
                    and mt_finished = false and pm_player_id = $1`;
        let result = await pool.query(sql, [pId]);
        return { status: 200, result: result.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.createRandomCards = async function (pmId,nCards) {
    try {
        for(let i=0; i < nCards; i++) {
            let sql = `select crd_id from card 
                   order by random()
                   limit 1`;
            let res = await pool.query(sql);
            let cardId = res.rows[0].crd_id;
            sql = `insert into deck (deck_pm_id,deck_pos_id,deck_card_id,deck_card_hp) 
                    values ($1,1,$2,1) returning *`;         
            await pool.query(sql,[pmId,cardId]);
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.createMatch = async function (pId) {
    try {
        let res = await this.getPlayerActiveMatches(pId);
        if (res.result.length > 0)
            return {status:400, 
                result:{msg:"You can only have one active match."}}
        let sql = `insert into match (mt_turn,mt_finished) 
                    values (1,false) returning *`;
        res = await pool.query(sql);
        let matchId = res.rows[0].mt_id;
        // player starts first
        sql = `insert into playermatch (pm_player_id,pm_match_id,pm_state_id,pm_hp) 
               values ($1,$2,1,10) returning *`;         
        res = await pool.query(sql,[pId,matchId]);
        let pmId = res.rows[0].pm_id;
        // Create 3 random cards (with repetition)
        this.createRandomCards(pmId,3);
        return { status: 200, result: 
            {msg: "Match successfully created.", 
             matchId:matchId, pmId: pmId} };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.joinMatch = async function (pId,mId) {
    try {
        let res = await this.getPlayerActiveMatches(pId);
        if (res.result.length > 0)
            return {status:400, 
                result:{msg:"You can only have one active match."}}
        
        let sql = `select * from playermatch where pm_match_id = $1`;
        res = await pool.query(sql,[mId]);
        // since the match always has a player, no player means no match
        if (res.rows.length == 0) {
            return {status:400, 
                result:{msg:"There is no match with that id"}}
        } else if(res.rows.length > 1) {
            return {status:400, 
                result:{msg:"That match is full"}}
        }
        let oId = res.rows[0].pm_id;
        sql = `insert into playermatch (pm_player_id,pm_match_id,pm_state_id,pm_hp) 
               values ($1,$2,4,10) returning *`;         
        res = await pool.query(sql,[pId,mId]);
        let pmId = res.rows[0].pm_id;
        // Create 2 random cards, you will draw one later
        this.createRandomCards(pmId,2);
        return { status: 200, result: {msg: "You successfully joined the match",
                                        pmId: pmId, oId: oId} };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}
