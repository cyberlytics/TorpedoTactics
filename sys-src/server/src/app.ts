import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

// errors
import { NotFoundError } from './errors/not-found-error'

// middlewares
import { errorHandler } from './middlewares/error-handler'

// routes
import { signoutRouter } from './routes/signout'

// create server
const server = express()

/**
 * The code below will configure
 * the express server
 */

// server.set('trust proxy', true) only necessary if server sits behind a proxy

server.use(express.json()) // parse body

server.use(
  cookieSession({
    // store session data within a cookie
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

/**
 * Here are the primary routes of the app
 */
server.use(signoutRouter)
server.all('*', async () => {
  throw new NotFoundError()
})

/**
 * Error handling
 */
server.use(errorHandler)

// don't know if this breaks functionality above,
// but socket.io requires http module
const app = require('http').Server(server);

export { app }
