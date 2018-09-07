import React from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import { Router } from 'react-router-dom'
import { store, history } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'
import { hot } from 'react-hot-loader'

/**
 * Main App component. Sets up the BrowserRouter for react-router, the theme for material-ui and the provider / store
 * for redux
 */
const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <Scenes />
        </MuiThemeProvider>
      </Router>
    </Provider>
  )
}

export default hot(module)(App)