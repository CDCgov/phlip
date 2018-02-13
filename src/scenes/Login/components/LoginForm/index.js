import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import Button from 'components/Button'
import { Paper } from 'material-ui'
import { Field, reduxForm } from 'redux-form'
import FormTextInput from 'components/FormTextInput'
import validate from './validate'

let LoginForm = ({ theme, handleSubmit, pristine, reset, error, submitting, children }) => {
  const bgColor = theme.palette.primary['500']

  const headerStyles = {
    backgroundColor: bgColor,
    height: 145
  }

  const logo = {
    paddingTop: '35px'
  }

  const formStyles = {
    width: 373,
    height: 439
  }

  return (
    <Paper style={formStyles}>
      <div style={headerStyles}>
        <Grid container direction="column" alignItems="center" justify="center">
          <div style={logo}>
            <Logo fontSize="55px" />
          </div>
        </Grid>
      </div>
      <form onSubmit={handleSubmit}>
        {children}
        {error && <Row style={{ paddingTop: 10, paddingBottom: 20, justifyContent: 'center' }}>
          <Typography color="error" align="center">{error}</Typography>
        </Row>}
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item>
            <Button type="submit" color="accent" value="Login" disabled={pristine || submitting} />
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

LoginForm = reduxForm({
  form: 'login',
  validate
})(LoginForm)

export default withTheme()(LoginForm)