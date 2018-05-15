import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App'
import { AppContainer } from 'react-hot-loader'

const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') // IE 10 or older
  const trident = ua.indexOf('Trident/') // IE 11
  return (msie > 0 || trident > 0)
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>
  , document.getElementById('root'))
}

if (isIE()) {
  window.alert('This application will not work in Internet Explorer. Please use Google Chrome.')
} else {
  render(App)
  if (module.hot) {
    module.hot.accept('./App', () => {
      const App = import('./App').default
      render(App)
    })
  }
}