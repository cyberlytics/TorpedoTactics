import mongoose, { HydratedDocument, Model, Schema} from "mongoose";

export interface IUser{
    username: string;
    password_hash: string;
}

export interface IUserMethods {
}

interface IUserModel extends Model<IUser, {}, IUserMethods>{
  createUser (username: string, password_hash: string): Promise<HydratedDocument<IUser>>;
  getUsers() :Promise<HydratedDocument<IUser>[]>;
  getOneUser(userid: Schema.Types.ObjectId): Promise<HydratedDocument<IUser>>;
  addUser(): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema : Schema<IUser, IUserModel> = new Schema<IUser, IUserModel>({
    username: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true, unique: true},
});

export const User = mongoose.model<IUser, IUserModel>('User',userSchema);

/**
 * Create a User in Database
 * @param username
 * @param password_hash
 * @returns Object of the create User
 */
userSchema.statics.createUser = async function(username: string, password_hash: string): Promise<HydratedDocument<IUser>> {
  const newUser : IUser = {
    username: username,
    password_hash: password_hash,
  }
  return await this.create(newUser);
};

/**
 * Get all users from Database
 * @returns a list of all User
 */
userSchema.statics.getUsers = async function():Promise<HydratedDocument<IUser, IUserMethods>[]> {
   return await this.find();
};

/**
Get one user from Database
@param gameId
@returns User or null
*/
userSchema.statics.getOneUser = async function (userid: Schema.Types.ObjectId):Promise<HydratedDocument<IUser, IUserMethods> | null>  {
   return await this.findById(userid);
}

/**
 * Find a User by username
 * @param username
 * @returns User or null
 */
userSchema.statics.getUserByName = async function (username : string) : Promise<HydratedDocument<IUser,IUserMethods> | null> {
  return await this.findOne({username: username})
}

