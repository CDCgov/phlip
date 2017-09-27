import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <div> la la la la la </div>
      </BrowserRouter>
    </Provider>
  )
};

App.propTypes = {};

export default App
