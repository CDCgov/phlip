import React from 'react'
import PropTypes from 'prop-types'
import Container from 'components/Layout'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import { Paper } from 'material-ui'
import { reduxForm } from 'redux-form'
import validate from '../validate'

let LoginFormView = null

let LoginForm = props => {

  const { theme, handleSubmit, pristine, reset, error, submitting, pivError, children } = props
  const bgColor = theme.palette.primary.main
}



export default withTheme()(LoginForm)