import express from 'express'
import { validateRequest } from '../middlewares/validate-request';
import { query } from 'express-validator';
import { retriveStats } from '../controllers/stats'

export default (router: express.Router) => {
    
    router.get(
        '/api/stats',
        [
            query('username').notEmpty().withMessage('Username must be provided'),
        ],
        validateRequest,
        retriveStats
    )
}