import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App'

/**
 * Check if the browser is IE
 */
const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') // IE 10 or older
  const trident = ua.indexOf('Trident/') // IE 11
  return (msie > 0 || trident > 0)
}

/**
 * If the browser is IE, then display and error, otherwise render the app.
 */
if (isIE()) {
  window.alert('This application will not work in Internet Explorer. Please use Google Chrome.')
} else {
  ReactDOM.render(<App />, document.getElementById('root'))
}