import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Scenes from 'scenes';

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <Scenes />
      </BrowserRouter>
    </Provider>
  )
};

App.propTypes = {};

export default App
