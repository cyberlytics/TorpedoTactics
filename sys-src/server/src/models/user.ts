import mongoose, { Schema} from "mongoose";

interface IUser{
    username: string;
    password: string;
}

const userSchema : Schema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
});


export const User = mongoose.model<IUser>('User',userSchema);

