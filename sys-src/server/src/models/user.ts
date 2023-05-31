import mongoose, {Model, HydratedDocument, Schema} from "mongoose";

export interface IUser{
    username: string;
    password_hash: string;
}


//methods for a Player Instance (Document)
export interface IUserMethods {

}

//methods on all Players 
interface IUserModel extends Model<IUser, {}, IUserMethods>{
    getUsers() : Promise<HydratedDocument<IUser, IUserMethods>[]>;
    getOneUser(userid: Schema.Types.ObjectId):Promise<HydratedDocument<IUser, IUserMethods> | null>;
    getUserByName(username : string) : Promise<HydratedDocument<IUser,IUserMethods> | null>;
    addUser(): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema : Schema<IUser, IUserModel> = new Schema<IUser, IUserModel>({
  username: {type: String, required: true, unique: true},
  password_hash: {type: String, required: true, unique: true},
});



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

//does the same thing as addUser
export const createUser = async (username: string, password_hash: string): Promise<HydratedDocument<IUser, IUserMethods>> => {
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
userSchema.statics.getUsers = async function():Promise<HydratedDocument<IUser, IUserMethods>[]> {
   return await this.find();
};

/**
Get one user from Database
@param gameId
@returns A Document of the User
*/
userSchema.statics.getOneUser = async function (userid: Schema.Types.ObjectId):Promise<HydratedDocument<IUser, IUserMethods> | null>  {
   return await this.findById(userid);
}

userSchema.statics.getUserByName = async function (username : string) : Promise<HydratedDocument<IUser,IUserMethods> | null> {
  return await this.findOne({username: username})
}

export const User = mongoose.model<IUser, IUserModel>('User',userSchema);
