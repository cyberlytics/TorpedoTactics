import { app } from './app'
import mongoose from 'mongoose';

const start = async () => {
  try{
  mongoose.connect("mongodb+srv://gruppegruen:TorpedoTactics@bcn.xuho2ki.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log('Verbindung zur MongoDB hergestellt');
  })
  } catch (err){
      console.error(err);
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.')
  })
}

start()
