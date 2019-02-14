const dotenv = require('dotenv').config()

module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS === '1' || false,
    devtools: false
  }
}