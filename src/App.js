import React, { Component } from 'react'
import { MuiThemeProvider } from 'material-ui/styles'
import { Router } from 'react-router-dom'
import { history } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'

/**
 * Main App component. Sets up the BrowserRouter for react-router, the theme for material-ui and the provider / store
 * for redux
 */
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <Scenes />
        </MuiThemeProvider>
      </Router>
    )
  }
}

export default App