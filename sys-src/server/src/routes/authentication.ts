import express from 'express';
import { login, register, signout } from '../controllers/authentication';
import { validateRequest } from '../middlewares/validate-request';
import { BCRYPT_MAX_LENGTH, BCRYPT_MIN_LENGTH, passwordRegex } from '../config/auth.config';
import { body } from 'express-validator';

export default (router: express.Router) => {
  /**
   * Register a User.
   * * @route POST /api/auth/signup
   */
  router.post(
    '/api/auth/signup',
    [
      body('password')
        .trim()
        .isLength({ min: BCRYPT_MIN_LENGTH, max: BCRYPT_MAX_LENGTH })
        .matches(passwordRegex)
        .withMessage('Password must be between 8 and 64 characters long.'),
      body(['username']).notEmpty().withMessage('Username must be atleast one character long.'),
    ],
    validateRequest,
    register,
  );

  /**
   * Login with a User.
   * * @route POST /api/auth/signin
   */
  router.post(
    '/api/auth/signin',
    [
      //body('email').isEmail().withMessage('Email must be valid'),
      body('password').trim().notEmpty().withMessage('You must supply a password'),
    ],
    validateRequest,
    login,
  );

  /**
   * Clears the request session.
   * * @route POST /api/auth/signout
   */
  router.post('/api/auth/signout', signout);
};
