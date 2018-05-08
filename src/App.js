import React from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import { Router } from 'react-router-dom'
import { store, history } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'

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

App.propTypes = {}

export default App
