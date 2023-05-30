import mongoose, { HydratedDocument, Schema} from "mongoose";

interface IUser{
    username: string;
    salt: string;
}

const userSchema : Schema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    salt: {type: String, required: true, unique: true},
});


export const User = mongoose.model<IUser>('User',userSchema);


/**
 * Create a User in Database
 * @param username
 * @param password
 * @returns Object of the create User
 */
userSchema.statics.addUser = async function(username: string, salt: string): Promise<HydratedDocument<IUser>> {
  const newUser : IUser = {
    username: username,
    salt: salt,
  }
  return await this.create(newUser);
};

export const createUser = async (username: string, salt: string): Promise<HydratedDocument<IUser>> => {
  const doc = new User({
    username: username,
    salt: salt,
  });
  return await doc.save();
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
