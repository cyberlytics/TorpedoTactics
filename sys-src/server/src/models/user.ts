import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';
import {Player} from './player'

export interface IUser {
  username: string;
  password_hash: string;
}

interface IUserMethods {}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  createUser(username: string, password_hash: string): Promise<HydratedDocument<IUser, IUserModel>>;
  getAllUsers(): Promise<HydratedDocument<IUser, IUserModel>[]>;
  getOneUser(userid: Schema.Types.ObjectId): Promise<HydratedDocument<IUser, IUserModel>>;
  getUserByName(username: string): Promise<HydratedDocument<IUser, IUserModel>|null >;
}

const userSchema: Schema<IUser, IUserModel> = new Schema<IUser, IUserModel>({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true, unique: true },
});

/**
 * Create a User in Database (adds player automatically)
 * @param username
 * @param password_hash
 * @returns Object of the create User
 */
userSchema.statics.createUser = async function (
  username: string,
  password_hash: string,
): Promise<HydratedDocument<IUser>> {
  const newUser: IUser = {
    username: username,
    password_hash: password_hash,
  };
  const newUserInDb : HydratedDocument<IUser> =  await this.create(newUser);
  await Player.addPlayer(newUserInDb.id);
  return newUserInDb;
};

/**
 * Get all users from Database
 * @returns a list of all User
 */
userSchema.statics.getAllUsers = async function (): Promise<HydratedDocument<IUser>[]> {
  return await this.find();
};

/**
Get one user from Database
@param gameId
@returns User or null
*/
userSchema.statics.getOneUser = async function (
  userid: Schema.Types.ObjectId,
): Promise<HydratedDocument<IUser> | null> {
  return await this.findById(userid);
};

/**
 * Find a User by username
 * @param username
 * @returns User or null
 */
userSchema.statics.getUserByName = async function (
  username: string,
): Promise<HydratedDocument<IUser> | null> {
  return await this.findOne({ username: username });
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
