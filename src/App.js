import React from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Scenes />
        </MuiThemeProvider>
      </Provider>
    </BrowserRouter>
  )
}

App.propTypes = {}

export default App
