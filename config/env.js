const dotenv = require('dotenv')
const paths = require('./paths')

module.exports = function getEnvVariables(nodeEnv) {
  dotenv.config({ path: paths.appDotEnv })
  process.env.NODE_ENV = nodeEnv

  let env = Object.keys(process.env)
    .filter(key => key.startsWith('APP_'))
    .reduce((e, key) => {
      e[key] = JSON.stringify(process.env[key])
      return e
    }, {})
  env = { ...env, NODE_ENV: `"${nodeEnv}"` }
  if (!env.APP_API_URL) { env.APP_API_URL = JSON.stringify('http://localhost:5000/api') }

  return env
}
