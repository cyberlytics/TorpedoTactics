import express from 'express';
import { Password } from 'src/services/password';

export const login = async (req: express.Request, res: express.Response) => {
    try {

    }catch (err: any) {
        res.status(500).json({message: err.message});
        return;
    }
}

export const register =async (req: express.Request, res: express.Response) => {
    try {
        const {username, password } = req.body;
        if( !username || !password ) {
            res.status(400).json({message: 'Missing username or password'});
            return;
        }


          // find existing username in database

          // throw bad request error if user exist

          // hash password
          const passwordHash = await Password.toHash(password);

          // create database transaction to save user

          // commit database transaction

          return res.status(201).send({
            message: 'Successful signed up!',
            links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }],
          });

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
