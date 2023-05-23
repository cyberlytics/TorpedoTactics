// import { getUserByEmail, createUser } from '../db/users.js';
import express from 'express';
// import { random, authentication } from '../helpers/index.js';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        // const {email, password} = req.body;
        // if( !email || !password) {
        //     res.status(400).json({message: 'Missing email or password'});
        //     return;
        // }

        // let user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        // if (!user) {
        //     res.status(400).json({message: 'User does not exist'});
        //     return;
        // }

        // const expectedHash = user.authentication?.salt ? authentication(user.authentication?.salt, password) : '';
        // if (expectedHash !== user.authentication?.password) {
        //     res.status(403).json({message: 'Wrong password'});
        //     return;
        // }

        // const salt = random();
        // const token = authentication(salt, user.authentication?.password);
        // user.authentication.salt = salt;
        // user.authentication.token = token;

        // await user.save();

        // res.cookie('WAE-AUTH-TOKEN', user.authentication.token, { domain: 'localhost', path: '/' });

        // return res.status(200).json(user).end();
    }catch (err: any) {
        res.status(500).json({message: err.message});
        return;
    }
}
export const register = async (req: express.Request, res: express.Response) => {
    try {
        // const {username, password, email } = req.body;
        // if( !username || !password || !email) {
        //     res.status(400).json({message: 'Missing username, password or email'});
        //     return;
        // }

        // const user = await getUserByEmail(email);
        // if (user) {
        //     res.status(400).json({message: 'User already exists'});
        //     return;
        // }

        // console.log('register', username, password, email);

        // const salt = random();
        // const newUser = await createUser({
        //     email,
        //     username,
        //     authentication: {
        //         salt,
        //         password: authentication(salt, password),
        //         token: authentication(salt, password),
        //     },
        // });

        // return res.status(200).json(newUser).end();;
    }catch (err: any) {
        res.status(500).json({message: err.message});
        return;
    }
};

export const signout = async (req: express.Request, res: express.Response) => {
  try {
    req.session = null

    return res.status(200).send({ message: 'Successful signed out!' })
  }catch (err: any) {
      res.status(500).json({message: err.message});
      return;
  }
};
