import { User,IUser } from "src/models/user";
import { Game, IGame } from "src/models/game";
import { Player, IPlayer } from "src/models/player";


//db funktionen von lukas? 
function addGame(id1,id2) {
    Game.addGame(id1,id2);
}

function endgame(winnerid,hitsplayer1,hitsplayer2,missesplayer1,missesplayer2) {
    Game.endgame(winnerid,hitsplayer1,hitsplayer2,missesplayer1,missesplayer2);
}
//timestamp fehlt eventuell? 
function updateplayerstats (id,hits,misses) {
    Player.getPlayer(id).updateStats(hits,misses);
}