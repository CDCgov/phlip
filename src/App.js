import React from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'

const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') // IE 10 or older
  const trident = ua.indexOf('Trident/') // IE 11
  return (msie > 0 || trident > 0)
}

const App = () => {
  return (
    isIE()
      ? <div>{window.alert('This application will not work in Internet Explorer. Please use another web browser such as Google Chrome.')}</div>
      : <BrowserRouter>
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
