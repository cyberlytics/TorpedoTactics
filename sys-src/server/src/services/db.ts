import { HydratedDocument,Schema } from 'mongoose'
import { User,IUser } from "../models/user";
import { Game, IGame, IGameMethods } from "../models/game";
import { Player, IPlayer } from "../models/player";



export async function saveStartedGame(username1:string,username2:string) {
    const user1:HydratedDocument<IUser> = await User.getUserByName(username1);
    const user2:HydratedDocument<IUser> = await User.getUserByName(username2);
    const player1:HydratedDocument<IPlayer> |null = await Player.getPlayerbyUserId(user1.id);
    const player2:HydratedDocument<IPlayer>|null = await Player.getPlayerbyUserId(user2.id);
    if (player1 == null || player2 == null) {
        return;
    }

    await Game.addGame(player1.id,player2.id);

}

export async function saveEndedGame(username1:string,username2:string,winnername:string,hitswinner:number,hitslooser:number,misseswinner:number,misseslooser:number) {
    const user1:HydratedDocument<IUser> = await User.getUserByName(username1);
    const user2:HydratedDocument<IUser> = await User.getUserByName(username2);
    const player1:HydratedDocument<IPlayer> |null = await Player.getPlayerbyUserId(user1.id);
    const player2:HydratedDocument<IPlayer>|null = await Player.getPlayerbyUserId(user2.id);
    if (player1 == null || player2 == null) {
        return;
    } 
   const actGame: HydratedDocument<IGame,IGameMethods> |null = await Game.getGamebyPlayers(player1.id,player2.id);
    if (actGame == null) {
        console.log("Game not found");
        return;
    }
    let winnerid:Schema.Types.ObjectId;
    if (username1 == winnername) {
        winnerid = player1.id;
    }
    else {
        winnerid = player2.id;
    }
   await actGame.endGame (winnerid,hitswinner,hitslooser,misseswinner,misseslooser);
}

// function updatePlayer (id,hits,misses, gameid) {
    //gameid ebenfalls hinzufügen
//     Player.getPlayer(id).updateStats(hits,misses);
// }



/*Testuser in Datenbank erstellt, zum Testen
        user1, pw1
        user2, pw2
*/
