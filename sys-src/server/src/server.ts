import { app } from './app'
import { SocketManager } from './services/socketManager';
import mongoose, {HydratedDocument} from 'mongoose';
import { IGame,Game, Gamestate, IGameMethods } from './models/game';
//import { IPlayer,Player } from './models/player'

const start = async () => {
  try{
  await mongoose.connect("mongodb+srv://feillukas:"+encodeURIComponent("pEj?VQK>w2*2Uk4UAk5MS<9mDiT7fYyZ")+"@wae.6bsejdu.mongodb.net/?retryWrites=true&w=majority")
    //"mongodb+srv://gruppegruen:TorpedoTactics@bcn.xuho2ki.mongodb.net/?retryWrites=true&w=majority")
  .then(async() => {
    console.log('Verbindung zur MongoDB hergestellt');

  //Example call static method
   const games : HydratedDocument<IGame, IGameMethods>[] = await Game.getGames();

   //Example call instance method with promise processing
   await games[0].changeState(Gamestate.aborted).then((changedGame: HydratedDocument<IGame, IGameMethods>) =>{
    console.log(changedGame);
   }).catch((error)=>{
    console.error(error);
   })
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
