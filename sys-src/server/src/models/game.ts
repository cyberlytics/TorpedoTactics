import mongoose, { Schema, Model, HydratedDocument} from "mongoose";

export enum Gamestate {
    preparation = "preparation",
    running = "running",
    terminated = "terminated",
    aborted = "aborted",
}

export interface IGame{
    playerid1: Schema.Types.ObjectId,
    playerid2: Schema.Types.ObjectId,
    winner?: Schema.Types.ObjectId,
    state: Gamestate,
    started: number,
    ended?: number,
    gamehistory: number[][],
}

//schema Definition
const gameSchema : Schema<IGame, IGameModel> = new Schema<IGame, IGameModel>({
    playerid1 : {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Player'},
    playerid2 : {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Player'},
    winner : {type: Schema.Types.ObjectId, unique: true, ref: 'Player'},
    state: { type: String, required: true, enum: Object.values(Gamestate) },
    started: { type: Number},
    ended: { type: Number},
    gamehistory: { type: [[Number]], required: true },
});

export const Game = mongoose.model<IGame, IGameModel>('Game', gameSchema);

//methods for e Game Instance (Document)
export interface IGameMethods {
    changeState(newstate : Gamestate) : Promise<HydratedDocument<IGame, IGameMethods>>;
}

//methods on all Games
interface IGameModel extends Model<IGame, {}, IGameMethods>{
    addGame (id1: Schema.Types.ObjectId, id2: Schema.Types.ObjectId): Promise<HydratedDocument<IGame, IGameMethods>>;
    getGames() :Promise<HydratedDocument<IGame, IGameMethods>[]>;
}


//static methods
gameSchema.statics.addGame = async function(id1: Schema.Types.ObjectId, id2: Schema.Types.ObjectId): Promise<HydratedDocument<IGame, IGameMethods>> {
   const newGame : IGame = {
    playerid1: id1,
    playerid2: id2,
    state: Gamestate.preparation,
    started: Date.now(),
    gamehistory: []};
   return await this.create(newGame);
};


gameSchema.statics.getGames = async function():Promise<HydratedDocument<IGame, IGameMethods>[]> {
    return await this.find();
};


gameSchema.statics.getGame= async function (gameId: Schema.Types.ObjectId):Promise<HydratedDocument<IGame, IGameMethods>[]> {
    return await this.find(gameId);
}



/*
    Next static Functions:
    - getGame(gameid)
*/

//instance methods
gameSchema.methods.changeState = async function(newstate:Gamestate):Promise<HydratedDocument<IGame, IGameMethods>>{
    this.state = newstate;
    return await this.save();
}

/*
    Next instance Functions:
        - gameEnded(winnerid, ended, state)
        - addGameMove  (playingfield[])
*/





export const Game = mongoose.model<IGame>('Game', gameSchema);