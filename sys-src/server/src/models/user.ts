import mongoose, { Schema, Document } from "mongoose";

const userSchema : Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
});

interface IUser extends Document{
    username: string;
    password: string;
}

export const User = mongoose.model<IUser>('User',userSchema);

