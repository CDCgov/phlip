/**
 * Setting up passport.js to use SAML stragety
 */
const SamlStrategy = require('passport-saml').Strategy
const dotenv = require('dotenv')
const paths = require('../config/paths')

dotenv.config({ path: paths.appDotEnv })

module.exports = function (passport, config) {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })
  
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  
  const saml_strategy = new SamlStrategy(
    {
      callbackUrl: process.env.SAML_CALLBACK_URL,
      entryPoint: process.env.SAML_ENTRY_POINT_URL,
      issuer: process.env.SAML_ISSUER,
      logoutUrl: process.env.APP_SAML_LOGOUT_URL,
      identifierFormat: process.env.SAML_IDENTIFIER_FORMAT,
      disableRequestedAuthnContext: true
    },
    (profile, done) => {
      return done(
        null,
        {
          id: profile.useraccountid,
          email: profile.email,
          firstName: profile.firstname,
          lastName: profile.lastname
        }
      )
    }
  )
  console.log(saml_strategy.generateServiceProviderMetadata())
  passport.use(saml_strategy)
}
