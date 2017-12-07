const express = require('express')
const chalk = require('chalk')
const proxy = require('http-proxy-middleware')
const app = express()

const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || 5200
const APP_API_URL = `${process.env.APP_API_URL}/api` || 'http://backend:80/api'

app.use(express.static('./dist/'))
app.use('/api', proxy(APP_API_URL))
app.use('/', express.static('./dist/index.html'))
app.use('*', express.static('./dist/index.html'))
app.listen(APP_PORT, APP_HOST, err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan(`Starting the production server on ${APP_HOST}:${APP_PORT}...`))
})