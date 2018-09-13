import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Route, Switch } from 'react-router-dom'
import Login from './Login'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import { persistor } from 'services/store'
import Main from './main'

/**
 * Main scenes component, where all of the page views are set. It sets the /login route and any other path be sent to
 * the AuthenticatedRoutes with the component AuthenticatedScenes. redux-persist `<PersistGate>` component is set up here.
 */
const Scenes = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <PersistGate persistor={persistor}>
        <AuthenticatedRoute component={Main} />
      </PersistGate>
    </Switch>
  )
}

export default Scenes
