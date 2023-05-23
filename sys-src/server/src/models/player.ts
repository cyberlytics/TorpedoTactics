import mongoose, { Schema} from "mongoose";

interface IPlayer{
    userid: Schema.Types.ObjectId;
    statistics:{
        gamesplayed: number,
        gameswon: number,
        timespend: number,
        hitmissrate: number,
    },
    games: Schema.Types.ObjectId[],
}

const playerSchema : Schema = new Schema<IPlayer>({
    userid: {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    statistics : {type: Object, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
});

export const Player = mongoose.model<IPlayer>('Player', playerSchema);