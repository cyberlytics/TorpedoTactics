import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password } = req.body;
        if( !username || !password ) {
            res.status(400).json({message: 'Missing username or password'});
            return;
        }

        // const existingUser = await User.findOne({ where: { email } }); => find user in db
        const existingUser: any = {
          userid: "123456789",
          username: "demoUser",
          password: "demoPassword"
        }

        /*
         * This code will go through the same process no matter what the user or the password is,
         * allowing the application to return in approximately the same response time. Preventing
         * the attacker to differentiate between a wrong username and a wrong password.
         */

        const passwordsMatch = await Password.compare(
          existingUser ? existingUser.password_hash : 'supersecretpassword',
          password
        )

        if (!existingUser || !passwordsMatch) {
          throw new BadRequestError('Invalid credentials', ['Change email or password.'])
        }

        // Generate JWT
        const userJwt = jwt.sign(
          {
            id: existingUser.userid,
            username: existingUser.username
          },
          process.env.JWT_KEY! // ad key to env file
        )
        // Store it on session object
        req.session = {
          jwt: userJwt
        }

        return res.status(200).send({
          userID: existingUser.userid,
          username: existingUser.username,
        })



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
