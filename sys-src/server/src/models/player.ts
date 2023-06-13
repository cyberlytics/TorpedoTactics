import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

export interface IPlayer {
  userid: Schema.Types.ObjectId;
  stats: {
    gamesplayed: number;
    gameswon: number;
    timespend: number;
    hits: number;
    misses: number;
  };
  games?: Schema.Types.ObjectId[];
}

export interface IPlayerMethods {
  updateStats(won: boolean,hits: number,misses: number,timespend: number)  : Promise<HydratedDocument<IPlayer, IPlayerMethods>>
}

interface IPlayerModel extends Model<IPlayer, {}, IPlayerMethods> {
  getPlayers(): Promise<HydratedDocument<IPlayer, IPlayerMethods>[]>;
  addPlayer(id:Schema.Types.ObjectId): Promise<HydratedDocument<IPlayer, IPlayerMethods>>;
  getPlayerbyUserId(userid:Schema.Types.ObjectId): Promise<HydratedDocument<IPlayer, IPlayerMethods>|null>;
}

const playerSchema: Schema<IPlayer, IPlayerModel> = new Schema<IPlayer, IPlayerModel>({
  userid: { type: Schema.Types.ObjectId, required: true,ref: 'User' }, //userid should be unique on production
  stats: { type: Object, required: true },
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
});


/**
 * Create a Player in Database
 * @returns Object of the create Player
 */
playerSchema.statics.addPlayer = async function (id : Schema.Types.ObjectId): Promise<
  HydratedDocument<IPlayer, IPlayerMethods>
> {
  const newPlayer: IPlayer = {
    userid: id,
    stats: { gamesplayed: 0, gameswon: 0, timespend: 0.0, hits: 0, misses: 0},
  };
  return await this.create(newPlayer);
};

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
  return await this.save();
};

export const Player = mongoose.model<IPlayer, IPlayerModel>('Player', playerSchema);
