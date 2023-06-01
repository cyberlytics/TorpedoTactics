import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import router from './routes/router'

// errors
import { NotFoundError } from './errors/not-found-error'

// middlewares
import { errorHandler } from './middlewares/error-handler'

// create server
var app = express()

/**
 * The code below will configure
 * the express server
 */

// app.set('trust proxy', true) only necessary if server sits behind a proxy

app.use(express.json()) // parse body

app.use(
  cookieSession({
    // store session data within a cookie
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

/**
 * The routes of the app are defined in the routes/router.ts file
 */
app.use('/', router())
app.all('*', async () => {
  throw new NotFoundError()
})

/**
 * Error handling
 */
app.use(errorHandler)

// don't know if this breaks functionality of anything,
// but socket.io requires http module
app = require('http').Server(app);

export { app }
