import { HydratedDocument,Schema } from 'mongoose'
import { User,IUser } from "src/models/user";
import { Game, IGame, IGameMethods } from "src/models/game";
import { Player, IPlayer } from "src/models/player";



export async function addGame(username1:string,username2:string) {
    const user1:HydratedDocument<IUser> = await User.getUserByName(username1);
    const user2:HydratedDocument<IUser> = await User.getUserByName(username2);
    const player1:HydratedDocument<IPlayer> |null = await Player.getPlayerbyUserId(user1.id);
    const player2:HydratedDocument<IPlayer>|null = await Player.getPlayerbyUserId(user2.id);
    if (player1 == null || player2 == null) {
        return;
    }

    Game.addGame(player1.id,player2.id);

}

export async function endGame(username1:string,username2:string,winnername:string,hitsplayer1:number,hitsplayer2:number,missesplayer1:number,missesplayer2:number) {
    const user1:HydratedDocument<IUser> = await User.getUserByName(username1);
    const user2:HydratedDocument<IUser> = await User.getUserByName(username2);
    const player1:HydratedDocument<IPlayer> |null = await Player.getPlayerbyUserId(user1.id);
    const player2:HydratedDocument<IPlayer>|null = await Player.getPlayerbyUserId(user2.id);
    if (player1 == null || player2 == null) {
        return;
    } 
   const ActGame: HydratedDocument<IGame,IGameMethods> |null = await Game.getGamebyPlayers(player1.id,player2.id);
    if (ActGame == null) {
        return;
    }
    let winnerid:Schema.Types.ObjectId;
    if (username1 == winnername) {
        winnerid = player1.id;
    }
    else {
        winnerid = player2.id;
    }
   await ActGame.endGame (winnerid,hitsplayer1,hitsplayer2,missesplayer1,missesplayer2);
}
// //timestamp fehlt eventuell? 
// function updateplayerstats (id,hits,misses) {
//     Player.getPlayer(id).updateStats(hits,misses);
// }