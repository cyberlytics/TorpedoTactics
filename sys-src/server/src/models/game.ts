import mongoose, { Schema} from "mongoose";

enum Gamestate {
    preparation,
    running,
    terminated,
    aborted
}

interface IGame{
    playerid1: Schema.Types.ObjectId,
    playerid2: Schema.Types.ObjectId,
    winner: Schema.Types.ObjectId,
    state: Gamestate,
    started: number,
    ended: number,
    gamehistory: number[][],
}

const gameSchema : Schema = new Schema<IGame>({
    playerid1 : {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Player'},
    playerid2 : {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Player'},
    winner : {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Player'},
    state: { type: Number, required: true, enum: Object.values(Gamestate) },
    started: { type: Number},
    ended: { type: Number},
    gamehistory: { type: [[Number]], required: true },
})

export const Game = mongoose.model<IGame>('Game', gameSchema);