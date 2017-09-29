import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import Scenes from 'scenes'
import store from 'services/store'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Scenes />
      </BrowserRouter>
    </Provider>
  )
};

App.propTypes = {};

export default App
