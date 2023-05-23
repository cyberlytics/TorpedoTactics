import express from 'express';
import { login, register, signout } from '../controllers/authentication.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { BCRYPT_MAX_LENGTH, BCRYPT_MIN_LENGTH, passwordRegex } from 'src/config/auth.config.js';
import { body } from 'express-validator';

export default (router: express.Router) => {
    /**
     * Register a User.
     * * @route POST /api/auth/signup
     */
    router.post('/auth/signup',
    [
      body('password')
        .trim()
        .isLength({ min: BCRYPT_MIN_LENGTH, max: BCRYPT_MAX_LENGTH })
        .matches(passwordRegex)
        .withMessage('Password must be between 8 and 64 characters long.'),
      body(['username'])
        .notEmpty()
        .withMessage('Username must be atleast one character long.'),
    ],
    validateRequest,
    register);

    router.post('/auth/signin', login);

    /**
     * Clears the request session.
     * * @route POST /api/auth/signout
     */
    router.post('/auth/signout', signout);
};
