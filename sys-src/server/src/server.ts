import { app } from './app';
import { SocketManager } from './services/socketManager';
import mongoose from 'mongoose';
import 'dotenv/config'
//const url = 'mongodb+srv://gruppegruen:TorpedoTactics@bcn.xuho2ki.mongodb.net/?retryWrites=true&w=majority';
const url2 = "mongodb+srv://feillukas:test@wae.6bsejdu.mongodb.net/?retryWrites=true&w=majority"

const start = async () => {
  try {
    // if (!process.env.JWT_KEY) {
    //   throw new Error('JWT_KEY must be defined')
    // }
    await mongoose
      .connect(
        url2,
      )
      .then(async () => {
        console.log('Verbindung zur MongoDB hergestellt');
      });

    // initialize SocketManager
    new SocketManager().initialize();
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.');
  });
};

start();
