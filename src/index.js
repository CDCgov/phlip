import React from 'react'
import { render } from 'react-dom'
import App from 'App'

const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') // IE 10 or older
  const trident = ua.indexOf('Trident/') // IE 11
  return (msie > 0 || trident > 0)
}

if (isIE()) {
  window.alert('This application will not work in Internet Explorer. Please use Google Chrome.')
} else {
  render(<App />, document.getElementById('root'))
}