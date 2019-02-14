module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    devtools: false
  },
  server: {
    command: 'node scripts/start.js',
    launchTimeout: 500000,
    port: 5200
  }
}