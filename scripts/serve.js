/**
 * Starts the node.js and express server for production mode
 */
const express = require('express')
const session = require('express-session')
const chalk = require('chalk')
const proxy = require('http-proxy-middleware')
const app = express()
const dotenv = require('dotenv')
const paths = require('../config/paths')
const compression = require('compression')
const fs = require('fs')
const https = require('https')
const http = require('http')
const bodyParser = require('body-parser')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

dotenv.config({ path: paths.appDotEnv })
const DEFAULT_API_URL = 'http://backend:80'

const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || 5200
const HTTP_APP_PORT = process.env.HTTP_APP_PORT || 443
const IS_PRODUCTION = process.env.API_HOST || false

// Determine if this should be considered production (will setup SAML Auth, and not basic)
const APP_API_URL = IS_PRODUCTION
  ? (`${process.env.APP_API_URL}/api` || `${DEFAULT_API_URL}/api`)
  : (process.env.APP_API_URL || DEFAULT_API_URL)

app.use(compression())
app.use(express.static('./dist/'))

if (IS_PRODUCTION) {
  app.use(session({ secret: process.env.APP_SESSION_SECRET || 'pleasedontusethisasasecret' }))
  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/json' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  require('./passport')(passport)

  app.use(passport.initialize())
  app.use(passport.session())

  // Test direct GET call to backend
  app.get('/auth/sams-login',
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/')
    }
  )

  // SAML login callback URL. Redirects the frontend to /login/verify-user
  app.post('/login/callback',
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      const token = jwt.sign({
        sub: 'Esquire',
        jti: '1d3ffc00-f6b1-4339-88ff-fe9045f19684',
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userEmail: req.user.email,
        Id: 8,
        iss: 'iiu.phiresearchlab.org',
        aud: 'iiu.phiresearchlab.Bearer'
      }, process.env.APP_JWT_SECRET)

      res.redirect(`/login/verify-user?token=${token}`)
    })

  const httpOptions = {
    key: fs.readFileSync(process.env.APP_CERT_PATH),
    cert: fs.readFileSync(process.env.APP_KEY_PATH),
    ca: fs.readFileSync(process.env.APP_CERT_AUTH_PATH),
    requestCert: false,
    rejectUnauthorized: false
  }
  const httpsHost = APP_HOST

  // Proxy all requests to /api to the backend API URL
  app.use('/api', proxy({ target: APP_API_URL }))

  // Send all requests to the react code
  app.use('/', express.static('./dist/index.html'))
  app.use('*', express.static('./dist/index.html'))

  // Start and HTTPS server
  https.createServer(httpOptions, app).listen(HTTP_APP_PORT, httpsHost, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan(`Starting the produciton server on ${APP_HOST}:${HTTP_APP_PORT}...`))
  })

  // Start an HTTP server and redirect all requests to HTTPS
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url })
    res.end()
  }).listen(80)

} else {

  // Proxy all requests to /api to the backend URL
  app.use('/api', proxy({ target: APP_API_URL }))

  // Send all requests to the react code
  app.use('/', express.static('./dist/index.html'))
  app.use('*', express.static('./dist/index.html'))

  // Start a server on APP_HOST and APP_PORT
  app.listen(APP_PORT, APP_HOST, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan(`Starting the production server on ${APP_HOST}:${APP_PORT}...`))
  })
}



