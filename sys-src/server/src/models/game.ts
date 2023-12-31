import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

export enum Gamestate {
  //preparation = 'preparation',
  running = 'running',
  terminated = 'terminated',
  aborted = 'aborted',
}
export interface IGame {
  playerid1: Schema.Types.ObjectId;
  playerid2: Schema.Types.ObjectId;
  winner?: Schema.Types.ObjectId;
  state: Gamestate;
  started: number;
  ended?: number;
  hitsplayer1: number;
  hitsplayer2: number;
  missesplayer1: number;
  missesplayer2: number;
}

//schema Definition
const gameSchema: Schema<IGame, IGameModel> = new Schema<IGame, IGameModel>({
  playerid1: { type: Schema.Types.ObjectId, required: true, ref: 'Player' },
  playerid2: { type: Schema.Types.ObjectId, required: true, ref: 'Player' },
  winner: { type: Schema.Types.ObjectId, ref: 'Player' },
  state: { type: String, required: true, enum: Object.values(Gamestate) },
  started: { type: Number },
  ended: { type: Number },
  hitsplayer1: { type: Number },
  hitsplayer2: { type: Number },
  missesplayer1: { type: Number },
  missesplayer2: { type: Number },
});

//methods for e Game Instance (Document)
export interface IGameMethods {
  endGame(winnerid:Schema.Types.ObjectId,hitsplayer1:number,hitsplayer2:number,missesplayer1:number,missesplayer2:number, aborted:boolean): Promise<HydratedDocument<IGame, IGameMethods>>;
}

//methods on all Games
interface IGameModel extends Model<IGame, {}, IGameMethods> {
  addGame(
    id1: Schema.Types.ObjectId,
    id2: Schema.Types.ObjectId,
  ): Promise<HydratedDocument<IGame, IGameMethods>>;
  getGames(): Promise<HydratedDocument<IGame, IGameMethods>[]>;
  getGamebyPlayers (playerid1:Schema.Types.ObjectId, playerid2:Schema.Types.ObjectId): Promise<HydratedDocument<IGame, IGameMethods> | null> 

}

//static methods
gameSchema.statics.addGame = async function (
  id1: Schema.Types.ObjectId,
  id2: Schema.Types.ObjectId,
): Promise<HydratedDocument<IGame, IGameMethods>> {
  const newGame: IGame = {
    playerid1: id1,
    playerid2: id2,
    state: Gamestate.running,
    started: Date.now(),
    hitsplayer1: 0,
    hitsplayer2: 0,
    missesplayer1: 0,
    missesplayer2: 0,
    };
  return await this.create(newGame);
};

gameSchema.statics.getGames = async function (): Promise<HydratedDocument<IGame, IGameMethods>[]> {
  return await this.find();
};

gameSchema.statics.getGame = async function (
  gameId: Schema.Types.ObjectId,
): Promise<HydratedDocument<IGame, IGameMethods>[]> {
  return await this.find(gameId);
};


//get the running Game by the Ids of the players
gameSchema.statics.getGamebyPlayers = async function (playerid1:Schema.Types.ObjectId, playerid2:Schema.Types.ObjectId): Promise<HydratedDocument<IGame, IGameMethods> | null> {
let gamebuffer:HydratedDocument<IGame, IGameMethods> |null = await this.findOne({playerid1:playerid1, playerid2:playerid2,state:Gamestate.running});
if(gamebuffer!=null){
  return gamebuffer;
}
else{
  return await this.findOne({playerid1:playerid2, playerid2:playerid1,state:Gamestate.running});
}
};


//instance methods
/*gameSchema.methods.changeState = async function (
  newstate: Gamestate,
): Promise<HydratedDocument<IGame, IGameMethods>> {
  this.state = newstate;
  return await this.save();
};*/


//save ended Game
gameSchema.methods.endGame = async function (
  winnerid: Schema.Types.ObjectId,
  hitswinner: number,
  hitslooser: number,
  misseswinner: number,
  misseslooser: number,
  aborted: boolean,
): Promise<HydratedDocument<IGame, IGameMethods>> {
  this.winner = winnerid;

  //save hits and misses for the right player
  if(winnerid == this.player1){
    this.hitsplayer1 = hitswinner;
    this.hitsplayer2 = hitslooser;
    this.missesplayer1 = misseswinner;
    this.missesplayer2 = misseslooser;
  } else {
    this.hitsplayer2 = hitswinner;
    this.hitsplayer1 = hitslooser;
    this.missesplayer2 = misseswinner;
    this.missesplayer1 = misseslooser;
  }
  this.ended = Date.now();
  this.state = aborted ? Gamestate.aborted : Gamestate.terminated
  return await this.save();
};

export const Game = mongoose.model<IGame, IGameModel>('Game', gameSchema);
