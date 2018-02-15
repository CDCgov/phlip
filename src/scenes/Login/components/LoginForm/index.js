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

let LoginForm = ({ theme, handleSubmit, pristine, reset, error, submitting, children }) => {
  const bgColor = theme.palette.primary['500']

  const headerStyles = {
    backgroundColor: bgColor,
    height: 145
  }

  const formStyles = {
    width: 373,
    height: 447,
    display: 'flex',
    flexDirection: 'column'
  }

  return (
    <Paper style={formStyles}>
      <Container column alignItems="center" justify="center" style={headerStyles}>
        <Logo fontSize="55px" />
      </Container>
      <form onSubmit={handleSubmit}>
        {children}
        <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
          {error && <Typography color="error" align="center">{error}</Typography>}
        </Row>
        <Row displayFlex flex style={{ justifyContent: 'center' }}>
          <Column style={{ padding: 16 }}>
            <Button type="submit" color="accent" value="Login" disabled={pristine || submitting} />
          </Column>
        </Row>
      </form>
    </Paper>
  )
}

LoginForm = reduxForm({
  form: 'login',
  validate
})(LoginForm)

export default withTheme()(LoginForm)