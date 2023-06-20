import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

export interface IPlayer {
  userid: Schema.Types.ObjectId;
  stats: {
    gamesplayed: number;
    gameswon: number;
    timespend: number; //in ms 
    hits: number;
    misses: number;
  };
  games?: Schema.Types.ObjectId[];
}

export interface IPlayerMethods {
  updateStats(won: boolean,hits: number,misses: number,timespend: number)  : Promise<HydratedDocument<IPlayer, IPlayerMethods>>
  addGame(gameid: Schema.Types.ObjectId) : Promise<HydratedDocument<IPlayer, IPlayerMethods>>
}

interface IPlayerModel extends Model<IPlayer, {}, IPlayerMethods> {
  getPlayers(): Promise<HydratedDocument<IPlayer, IPlayerMethods>[]>;
  addPlayer(userid:Schema.Types.ObjectId): Promise<HydratedDocument<IPlayer, IPlayerMethods>>;
  getPlayer(id:Schema.Types.ObjectId): Promise<HydratedDocument<IPlayer, IPlayerMethods> | null>;
  getPlayerbyUserId(userid:Schema.Types.ObjectId): Promise<HydratedDocument<IPlayer, IPlayerMethods>|null>;
}

const playerSchema: Schema<IPlayer, IPlayerModel> = new Schema<IPlayer, IPlayerModel>({
  userid: { type: Schema.Types.ObjectId, required: true,ref: 'User' }, 
  stats: { type: Object, required: true },
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
});


//static methods

/**
 * Create a Player in Database
 * @returns Object of the create Player
 */
playerSchema.statics.addPlayer = async function (userid : Schema.Types.ObjectId): Promise<
  HydratedDocument<IPlayer, IPlayerMethods>
> {
  const newPlayer: IPlayer = {
    userid: userid,
    stats: { gamesplayed: 0, gameswon: 0, timespend: 0.0, hits: 0, misses: 0},
  };
  return await this.create(newPlayer);
};

playerSchema.statics.getPlayer = async function (id: Schema.Types.ObjectId) : Promise<HydratedDocument<IPlayer,IPlayerMethods> | null>{
  return await this.findById(id);
}

/**
 * Get a list of all Players from Database
 * @returns a list of all Player
 */
playerSchema.statics.getPlayers = async function (): Promise<
  HydratedDocument<IPlayer, IPlayerMethods>[]
> {
  return await this.find();
};

playerSchema.statics.getPlayerbyUserId = async function (userid:Schema.Types.ObjectId): Promise<
  HydratedDocument<IPlayer, IPlayerMethods>|null> 
  {
  return await this.findOne({ userid: userid });
};


//instance methods

playerSchema.methods.updateStats = async function (
  won: boolean,
  hits: number,
  misses: number,
  timespend: number,  
): Promise<HydratedDocument<IPlayer, IPlayerMethods>> {
  this.stats.gamesplayed += 1;
  this.stats.misses += misses;
  this.stats.hits += hits;
  this.stats.timespend += timespend;
  if (won) {
    this.stats.gameswon += 1;
  }
  this.markModified('stats');
  return await this.save();
  
};

playerSchema.methods.addGame = async function (gameid: Schema.Types.ObjectId) : Promise<HydratedDocument<IPlayer, IPlayerMethods>>{
  this.games.push(gameid);
  return await this.save();
} 

export const Player = mongoose.model<IPlayer, IPlayerModel>('Player', playerSchema);
