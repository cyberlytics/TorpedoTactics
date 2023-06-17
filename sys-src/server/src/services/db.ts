import { HydratedDocument,Schema } from 'mongoose'
import { User,IUser } from "../models/user";
import { Game, IGame, IGameMethods } from "../models/game";
import { Player, IPlayer, IPlayerMethods } from "../models/player";

//saves the playerids, so you don't have to query them from the database every time
let playerids : Map<string, Schema.Types.ObjectId> = new Map<string, Schema.Types.ObjectId>();


//save the started game to the db
export async function saveStartedGame(username1:string,username2:string) {
    //gets players by usernames
    const user1:HydratedDocument<IUser> = await User.getUserByName(username1);
    const user2:HydratedDocument<IUser> = await User.getUserByName(username2);
    if(user1 == null || user2 == null){
        return;
    }
    const player1:HydratedDocument<IPlayer, IPlayerMethods> |null = await Player.getPlayerbyUserId(user1.id);
    const player2:HydratedDocument<IPlayer, IPlayerMethods>|null = await Player.getPlayerbyUserId(user2.id);
    if (player1 == null || player2 == null) {
        return;
    }
    //save playerids 
    playerids.set(username1, player1.id);
    playerids.set(username2, player2.id);

    //create and save new Game
    await Game.addGame(player1.id,player2.id).then(async(newGame : HydratedDocument<IGame>) =>  {
        console.log("Saved the game "+ newGame.id+ " with the started values to the db");
        //add new Game to players
        await player1.addGame(newGame.id);
        await player2.addGame(newGame.id);
    })
    .catch(error => console.log("Error saving new game: "+error));
}

//update the started game in the db with the ended values
export async function saveEndedGame(username1:string,username2:string,winnername:string,hitswinner:number,hitslooser:number,misseswinner:number,misseslooser:number, aborted: boolean) {
    if (!playerids.has(username1) || !playerids.has(username2)) {
        return;
    }

    let winnerid : Schema.Types.ObjectId;
    let looserid : Schema.Types.ObjectId;
    if(username1 == winnername){
        winnerid = playerids.get(username1)!;
        looserid = playerids.get(username2)!;
    } else {
        winnerid = playerids.get(username2)!;
        looserid = playerids.get(username1)!;
    }   

   const actGame: HydratedDocument<IGame,IGameMethods> |null = await Game.getGamebyPlayers(winnerid,looserid);
    if (actGame == null) {
        console.log("Game with "+winnerid+" and "+looserid+" not found to save");
        return;
    }

   //update the game with the values for a ended game
   await actGame.endGame (winnerid,hitswinner,hitslooser,misseswinner,misseslooser, aborted).then(async(endedGame : HydratedDocument<IGame>)=>{
        console.log("Updated "+endedGame.id+ " with the values of the ended game");
        //Update the stats of the player
        await updatePlayer(winnerid, hitswinner, misseswinner, true, endedGame.ended! - endedGame.started);
        await updatePlayer(looserid, hitslooser, misseslooser, false, endedGame.ended! - endedGame.started);
   })
   .catch(error => console.log("Error saving ended Game: "+error));

   playerids.delete(username1);
   playerids.delete(username2);
}

//updates the stats for a player
async function updatePlayer (id : Schema.Types.ObjectId,hits : number,misses : number, won: boolean, gameduration: number) {
    let player : HydratedDocument<IPlayer, IPlayerMethods> | null = await Player.getPlayer(id);
    if(player == null){
        console.log("player not found to update stats");
        return;
    }
    await player.updateStats(won, hits, misses, gameduration);
}

/*Testuser in Datenbank erstellt, zum Testen
        user1, pw1
        user2, pw2
*/