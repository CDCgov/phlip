const dotenv = require('dotenv')
const paths = require('./paths')

module.exports = function getEnvVariables(nodeEnv) {
  dotenv.config({ path: paths.appDotEnv })

  let env = Object.keys(process.env)
    .filter(key => key.startsWith('APP_'))
    .reduce((e, key) => {
      e[key] = JSON.stringify(process.env[key])
      return e
    }, {})

  env = { ...env, 'process.env.NODE_ENV': JSON.stringify(`${nodeEnv}`) }
  if (!env.APP_API_URL) { env.APP_API_URL = JSON.stringify('http://backend:80/api') }
  if (!env.APP_LOG_REQUESTS) { env['process.env.APP_LOG_REQUESTS'] = '0' }

  return env
}
