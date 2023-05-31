import { app } from './app'
import { SocketManager } from './services/socketManager';
import mongoose, {HydratedDocument} from 'mongoose';
import { IUser,User, IUserMethods } from './models/user';
//import { IPlayer,Player } from './models/player'

const start = async () => {
  try{
    await mongoose.connect("mongodb+srv://gruppegruen:TorpedoTactics@bcn.xuho2ki.mongodb.net/?retryWrites=true&w=majority")
  .then(async() => {
    console.log('Verbindung zur MongoDB hergestellt');

  //Example call static method
   const users : HydratedDocument<IUser, IUserMethods>[] = await User.getUsers();
   console.log(users);
   //Example call instance method with promise processing
   let user : HydratedDocument<IUser, IUserMethods> | null = await User.getUserByName('test');
   //Only the user
   let realUser = user!.toObject() as IUser;
   console.log(realUser);
  })

    // initialize SocketManager
    new SocketManager().initialize();
  } catch (err){
      console.error(err);
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.')
  })
}

start()
