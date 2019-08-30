import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from 'services/theme'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'

export default class ThemeWrapper extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          {this.props.children}
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    )
  }
}