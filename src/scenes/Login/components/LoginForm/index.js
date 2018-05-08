import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import Button from 'components/Button'
import { Paper } from 'material-ui'
import { reduxForm } from 'redux-form'
import validate from './validate'
import Divider from 'material-ui/Divider'

let LoginForm = ({ theme, handleSubmit, pristine, reset, error, submitting, pivError, children }) => {
  const bgColor = theme.palette.primary.main

  const headerStyles = {
    backgroundColor: bgColor,
    height: 145
  }

  const formStyles = {
    width: 350,
    display: 'flex',
    flexDirection: 'column'
  }

  return (
    <Paper style={formStyles}>
      <Container column alignItems="center" justify="center" style={headerStyles}>
        <Logo height="auto" width={261} />
      </Container>
      <form onSubmit={handleSubmit}>
        {children}
        <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
          {error && <Typography color="error" align="center">{error}</Typography>}
          {pivError && <Typography color="error" align="center">{pivError}</Typography>}
        </Row>
        <Row displayFlex flex style={{ justifyContent: 'center', padding: 16 }}>
          <Button type="submit" color="accent" value="Login" disabled={pristine || submitting} />
        </Row>
        <Divider />
      </form>
      <Container column style={{ padding: 30 }}>
        <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography>
            You must be registered with SAMS and required to sign in with your CDC account below, otherwise
            you will receive a sign in error.
          </Typography>
        </Row>
        <Row displayFlex flex style={{ justifyContent: 'center', paddingTop: 20 }}>
          <Column style={{ padding: 16 }}>
            <Button href={process.env.APP_SAML_REQUEST_URL} type="button" color="accent" value="PIV Login" />
          </Column>
        </Row>
        {pivError && <Typography color="error" align="center">{pivError}</Typography>}
      </Container>
    </Paper>
  )
}

LoginForm = reduxForm({
  form: 'login',
  validate
})(LoginForm)

export default withTheme()(LoginForm)