import mongoose, { HydratedDocument, Schema} from "mongoose";

interface IUser{
    username: string;
    password: string;
}

const userSchema : Schema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
});


export const User = mongoose.model<IUser>('User',userSchema);


/**
 * Create a User in Database
 * @param eingabeUsername 
 * @param password 
 * @returns Object of the create User
 */
userSchema.statics.addUser = async function(eingabeUsername: string, password: string): Promise<HydratedDocument<IUser>> {
  const newUser : IUser = {
    username: eingabeUsername,
    password: password,
  }
  return await this.create(newUser);
};

/**
 * Get all users from Database
 * @returns a list of all User
 */
userSchema.statics.getUsers = async function():Promise<HydratedDocument<IUser>[]> {
   return await this.find();
};

/**
Get one user from Database
@param gameId
@returns A Document of the User
*/
userSchema.statics.getOneUser = async function (userid: Schema.Types.ObjectId):Promise<HydratedDocument<IUser>> {
   return await this.findById(userid);
}
