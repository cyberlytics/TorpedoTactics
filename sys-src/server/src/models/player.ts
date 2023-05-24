import mongoose, { Schema, Model, HydratedDocument} from "mongoose";

export interface IPlayer{
    userid?: Schema.Types.ObjectId;
    statistics:{
        gamesplayed: number,
        gameswon: number,
        timespend: number,
        hitmissrate: number,
    },
    games?: Schema.Types.ObjectId[],
}

//methods for a Player Instance (Document)
export interface IPlayerMethods {

}

//methods on all Players 
interface IPlayerModel extends Model<IPlayer, {}, IPlayerMethods>{
    getPlayers() : Promise<HydratedDocument<IPlayer, IPlayerMethods>[]>;
    addPlayer(): Promise<HydratedDocument<IPlayer, IPlayerMethods>>
}

//userid should be unique, only for developing
const playerSchema : Schema<IPlayer, IPlayerModel> = new Schema<IPlayer, IPlayerModel>({
    userid: {type: Schema.Types.ObjectId, ref: 'User'},
    statistics : {type: Object, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
});


//static methods
playerSchema.statics.addPlayer = async function(): Promise<HydratedDocument<IPlayer, IPlayerMethods>> {
    const newPlayer : IPlayer = {statistics: {gamesplayed:0, gameswon: 0, timespend: 0.0, hitmissrate:0.0}};
    return await this.create(newPlayer);
}

playerSchema.statics.getPlayers = async function():Promise<HydratedDocument<IPlayer, IPlayerMethods>[]> {
    return await this.find();
};

//instance methods

//export model
export const Player = mongoose.model<IPlayer, IPlayerModel>('Player', playerSchema);