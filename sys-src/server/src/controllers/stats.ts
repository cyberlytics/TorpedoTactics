import express from 'express';
import { HydratedDocument} from 'mongoose'
import { User,IUser } from "../models/user";
import { Player, IPlayer} from "../models/player";

export const retriveStats = async(req: express.Request, res: express.Response) =>{
    try{
        const username = req.query.username?.toString();
        if(!username){
            res.status(400).json({message: ' Missing username'});
            return;
        }
        const user:HydratedDocument<IUser>|null = await User.getUserByName(username);
        if(!user){
            res.status(404).json({message: 'Username '+ username+ " not found"});
            return;
        }

        const player:HydratedDocument<IPlayer>|null = await Player.getPlayerbyUserId(user.id);
        res.status(200).json(player?.stats);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
        return;
    }
}