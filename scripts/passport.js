/**
 * Setting up passport.js to use SAML stragety
 */

const SamlStrategy = require('passport-saml').Strategy
const fs = require('fs')


module.exports = function (passport, config) {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  const saml_strategy = new SamlStrategy(
    {
      //TODO: Create process.env variables
      callbackUrl: 'https://phlipdev.cdc.gov/login/callback',
      entryPoint: 'https://trust-stg.cdc.gov/affwebservices/public/saml2sso?SPID=phlipdev-project',
      issuer: 'phlipdev-project',
      logoutUrl: 'https://trust-stg.cdc.gov/affwebservices/public/saml2slo',
      // cert: fs.readFileSync('/sec/certs/cert.pem'),
      identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent'
    },
    (profile, done) => {
      return done(null,
        {
          id: profile.useraccountid,
          email: profile.email,
          firstName: profile.firstname,
          lastName: profile.lastname
        })
    })

  console.log('SAML METADATA: ', saml_strategy.generateServiceProviderMetadata())

  passport.use(saml_strategy)

}
