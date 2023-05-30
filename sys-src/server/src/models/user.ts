import mongoose, { HydratedDocument, Schema} from "mongoose";

interface IUser{
    username: string;
    password_hash: string;
}

const userSchema : Schema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true, unique: true},
});


export const User = mongoose.model<IUser>('User',userSchema);


/**
 * Create a User in Database
 * @param username
 * @param password_hash
 * @returns Object of the create User
 */
userSchema.statics.addUser = async function(username: string, password_hash: string): Promise<HydratedDocument<IUser>> {
  const newUser : IUser = {
    username: username,
    password_hash: password_hash,
  }
  return await this.create(newUser);
};

export const createUser = async (username: string, password_hash: string): Promise<HydratedDocument<IUser>> => {
  const doc = new User({
    username: username,
    password_hash: password_hash,
  });
  return await doc.save();
};

export const findUser = async (username: string): Promise<HydratedDocument<IUser>> => {
  let user = await User.findOne({username: username});
  if (!user) {
    throw new Error("User not found");
  }
  return user;
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
