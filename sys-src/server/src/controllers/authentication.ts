import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';
import { HydratedDocument } from 'mongoose';

/**
 * Login as a user and create a session
 * @param req = {username, password}
 * @param res = {message}
 * @returns Success Message
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Missing username or password' });
      return;
    }

    const user: HydratedDocument<IUser> = await User.getUserByName(username);

    /*
     * This code will go through the same process no matter what the user or the password is,
     * allowing the application to return in approximately the same response time. Preventing
     * the attacker to differentiate between a wrong username and a wrong password.
     */

    const passwordsMatch = await Password.compare(
      user ? user.password_hash : 'supersecretpassword',
      password,
    );

    if (!user || !passwordsMatch) {
      throw new BadRequestError('Invalid credentials', ['Change username or password.']);
    }

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_KEY!, // Add key to environment variable
    );
    //Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send({
      message: 'Successful signed in!',
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};

/**
 * Register a new user
 * @param req = {username, password}
 * @param res = {message}
 * @returns Success Message with href to login
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Missing username or password' });
      return;
    }

    if (await User.findOne({ where: { username: username } })) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    let password_hash = await Password.toHash(password);

    const user: HydratedDocument<IUser>[] = await User.create(username, password_hash);
    if (!user) {
      res.status(400).json({ message: 'Something went wrong on User creation' });
      return;
    }

    // commit database transaction

    return res.status(201).send({
      message: 'Successful signed up!',
      links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }],
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};

/**
 * Signout a user
 * @param req
 * @param res = {message}
 * @returns Success Message
 */
export const signout = async (req: express.Request, res: express.Response) => {
  try {
    req.session = null;

    return res.status(200).send({ message: 'Successful signed out!' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};
