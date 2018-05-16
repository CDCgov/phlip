// config/styleguide/ThemeWrapper.js
import React, { Component } from 'react'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'

export default class ThemeWrapper extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.props.children}
      </MuiThemeProvider>
    )
  }
}