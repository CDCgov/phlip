import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Admin from './Admin'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import HeaderedLayout from 'components/HeaderedLayout'
import { persistor } from 'services/store'
import axios from 'axios'
import { isLoggedInTokenExists, getToken } from '../services/authToken'
import CodingScheme from './CodingScheme'
import Coding from './Coding'

const AuthenticatedScenes = () => (
  <Switch>
    <Route path="/project/:id/coding-scheme" component={CodingScheme} />
    <Route path="/project/:id/code" component={Coding} />
    <HeaderedLayout>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Home} />
      </Switch>
    </HeaderedLayout>
  </Switch>
)

const Scenes = () => {
  if (isLoggedInTokenExists()) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`
  }
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <PersistGate persistor={persistor}>
        <AuthenticatedRoute path="/" component={AuthenticatedScenes} />
      </PersistGate>
    </Switch>
  )
}

export default Scenes
