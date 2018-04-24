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

const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || 5200
const HTTP_APP_PORT = process.env.HTTP_APP_PORT || 443
const APP_API_URL = `${process.env.APP_API_URL}/api` || 'http://backend:80/api'
const IS_PRODUCTION = process.env.API_HOST || false

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

  //Test direct GET call to backend
  app.get('/auth/sams-login',
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/')
    }
  )

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

  app.use('/api', proxy({ target: APP_API_URL }))
  app.use('/', express.static('./dist/index.html'))
  app.use('*', express.static('./dist/index.html'))

  https.createServer(httpOptions, app).listen(HTTP_APP_PORT, httpsHost, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan(`Starting the produciton server on ${APP_HOST}:${HTTP_APP_PORT}...`))
  })
} else {
  app.use('/api', proxy({ target: APP_API_URL }))
  app.use('/', express.static('./dist/index.html'))
  app.use('*', express.static('./dist/index.html'))

  app.listen(APP_PORT, APP_HOST, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan(`Starting the production server on ${APP_HOST}:${APP_PORT}...`))
  })
}



