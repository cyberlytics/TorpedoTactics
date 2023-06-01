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

export interface IPlayerMethods {

}

interface IPlayerModel extends Model<IPlayer, {}, IPlayerMethods>{
    getPlayers() : Promise<HydratedDocument<IPlayer, IPlayerMethods>[]>;
    addPlayer(): Promise<HydratedDocument<IPlayer, IPlayerMethods>>
}

const playerSchema : Schema<IPlayer, IPlayerModel> = new Schema<IPlayer, IPlayerModel>({
    userid: {type: Schema.Types.ObjectId, ref: 'User'},    //userid should be unique on production
    statistics : {type: Object, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
});

export const Player = mongoose.model<IPlayer, IPlayerModel>('Player', playerSchema);

/**
 * Create a Player in Database
 * @returns Object of the create Player
 */
playerSchema.statics.addPlayer = async function(): Promise<HydratedDocument<IPlayer, IPlayerMethods>> {
    const newPlayer : IPlayer = {statistics: {gamesplayed:0, gameswon: 0, timespend: 0.0, hitmissrate:0.0}};
    return await this.create(newPlayer);
}

/**
 * Get a list of all Players from Database
 * @returns a list of all Player
 */
playerSchema.statics.getPlayers = async function():Promise<HydratedDocument<IPlayer, IPlayerMethods>[]> {
    return await this.find();
};
