/**
 * Starts the node.js and express server for production mode
 */
const express = require('express')
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
const helmet = require('helmet')
const constants = require('constants')

dotenv.config({ path: paths.appDotEnv })

const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || 5200
const HTTPS_APP_PORT = process.env.HTTPS_APP_PORT || 443
const IS_HTTPS = process.env.APP_IS_HTTPS === '1' || false
const IS_SAML_ENABLED = process.env.APP_IS_SAML_ENABLED === '1' || false
const APP_API_URL = process.env.APP_API_URL || '/api'
const APP_DOC_MANAGE_API = process.env.APP_DOC_MANAGE_API || '/docsApi'
let httpsOptions = {}

let samlSrcLogout = 'https://auth-stg.cdc.gov'

if (IS_HTTPS) {
  httpsOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    ca: fs.readFileSync(process.env.CERT_AUTH_PATH),
    requestCert: true,
    rejectUnauthorized: false,
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_TLSv1
  }
  
  /**
   * Add additional certs to trust (like cdc certs)
   * @type {string[]}
   */
  const trustedCa = [
    '/etc/pki/tls/certs/ca-bundle.crt',
    process.env.NODE_EXTRA_CA_CERTS
  ]
  
  https.globalAgent.options.ca = []
  for (const ca of trustedCa) {
    https.globalAgent.options.ca.push(fs.readFileSync(ca))
  }
}

app.use(compression())
app.use(helmet())
app.use(helmet.hsts({
  // Must be at least 1 year to be approved
  maxAge: 31536000,
  // Must be enabled to be approved
  includeSubDomains: true,
  preload: true
}))

let connectSrc = APP_API_URL
if (connectSrc.endsWith('/api')) {
  connectSrc = connectSrc.slice(0, connectSrc.length - 4)
}

let docConnectSrc = APP_DOC_MANAGE_API
if (docConnectSrc.endsWith('/api')) {
  docConnectSrc = docConnectSrc.slice(0, docConnectSrc.length - 4)
}

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\'', 'https:'],
    styleSrc: ['\'self\'', 'code.jquery.com', '\'unsafe-inline\'', 'fonts.googleapis.com'],
    scriptSrc: [
      '\'self\'', 'code.jquery.com', '\'unsafe-inline\'', 'www.cdc.gov', 'cdc.gov',
      '\'unsafe-eval\'', 'www.google-analytics.com', 'search.usa.gov',samlSrcLogout
    ],
    objectSrc: ['\'self\''],
    connectSrc: ['\'self\'', 'www.cdc.gov', 'cdc.gov', connectSrc, 'www.google-analytics.com',samlSrcLogout,'https://wisz-sams-eig01.cdc.gov'],
    imgSrc: ['\'self\'', 'data:', 'www.google-analytics.com', 'stats.search.usa.gov', 'cdc.112.2o7.net'],
    fontSrc: ['\'self\'', 'fonts.google.com', 'fonts.gstatic.com']
  },
  setAllHeaders: true
}))
app.use(helmet.noCache())

// Proxy all requests to /api to the backend API URL

app.use('/api', proxy({
  target: APP_API_URL,
  ...IS_HTTPS ? { ssl: httpsOptions, changeOrigin: true, secure: true, agent: https.globalAgent } : {}
}))
app.use('/docsApi', proxy({ target: APP_DOC_MANAGE_API, pathRewrite: { '^/docsApi': '/api' } }))

if (IS_SAML_ENABLED) {
  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/json' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  require('./passport')(passport)
  
  app.use(passport.initialize())
  app.use(passport.session())
  
  // Test direct GET call to backend
  app.get(
    '/auth/sams-login',
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/')
    }
  )
  
  // SAML login callback URL. Redirects the frontend to /login/verify-user
  app.post(
    '/login/callback',
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
      }, process.env.JWT_SECRET)

      res.redirect(`/login/verify-user?token=${token}&token2=${req.user.nameID}&token3=${req.user.sessionIndex}&token4=${req.user.nameIDFormat}`)
    }
  )

}

// Starting point for logout
app.get('/logout',(req, res) => {
  const samlStrategy = passport._strategy('saml')
  const samlProfile = {
    user : {
      nameID: req.query.nameID,
      nameIDFormat: req.query.nameIDFormat,
      sessionIndex: req.query.sessionIndex
    }
  }
  samlStrategy.logout(samlProfile, (err, requestUrl) => {
    res.send(requestUrl)
  })
})

app.use(express.static('./dist/'))
app.use('/', express.static('./dist/index.html'))
app.use('*', express.static('./dist/index.html'))

if (IS_HTTPS) {
  const httpsHost = APP_HOST
  const httpOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    ca: fs.readFileSync(process.env.CERT_AUTH_PATH),
    requestCert: true,
    rejectUnauthorized: false,
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_TLSv1
  }
  
  // Start and HTTPS server
  https.createServer(httpOptions, app).listen(HTTPS_APP_PORT, httpsHost, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan(`Starting the production server on ${APP_HOST}:${HTTPS_APP_PORT}...`))
  })
  
  // Start an HTTP server and redirect all requests to HTTPS
  http.createServer(function (req, res) {
    res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url })
    res.end()
  }).listen(APP_PORT)
} else {
  http.createServer(app).listen(APP_PORT, APP_HOST, err => {
    if (err) {
      console.log(err)
    }
    console.log(chalk.cyan(`Starting the production server on ${APP_HOST}:${APP_PORT}...`))
  })
}
