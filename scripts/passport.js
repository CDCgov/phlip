const SamlStrategy = require('passport-saml').Strategy
const fs = require('fs')

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  passport.use(new SamlStrategy(
    {
      callbackUrl: 'https://phliptest.phiresearchlab.org/login/callback',
      entryPoint: 'https://trust-stg.cdc.gov/affwebservices/public/saml2sso?SPID=esquire-project',
      issuer: 'esquire-project',
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
  )

}
