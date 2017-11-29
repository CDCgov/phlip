import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Admin from './Admin'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import AuthenticatedLayout from 'components/AuthenticatedLayout'
import { persistor } from 'services/store'

const AuthenticatedScenes = () => (
  <AuthenticatedLayout>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/" component={Home} />
    </Switch>
  </AuthenticatedLayout>
)

const Scenes = () => {
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
