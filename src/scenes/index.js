import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { matchPath } from 'react-router'
import Home from './Home'
import Login from './Login'
import Admin from './Admin'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import HeaderedLayout from 'components/HeaderedLayout'
import { persistor } from 'services/store'
import CodingScheme from './CodingScheme'
import Coding from './Coding'
import Validation from './Validation'
import Protocol from './Protocol'
import AddEditProject from 'scenes/Home/scenes/AddEditProject'
import AddEditJurisdictions from 'scenes/Home/scenes/AddEditJurisdictions'
import JurisdictionForm from 'scenes/Home/scenes/AddEditJurisdictions/components/JurisdictionForm'

const nonCoderPaths = [
  '/project/add',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

const modalPath = '/project/edit/:id'

const checkForModalMatch = (pathname, role) => {
  let location = pathname
  if (matchPath(pathname, { path: modalPath }) !== null) {
    location = '/home'
  }

  nonCoderPaths.forEach(path => {
    const match = matchPath(pathname, { path })
    if (match !== null) location = '/home'
  })

  return location
}

const AuthenticatedScenes = ({ match, location, role, ...otherProps }) => {
  // this is for jurisdictions / add/edit project modals. We want the modals to be displayed on top of the home screen,
  // so we check if it's one of those routes and if it is set the location to /home
  const currentLocation = { ...location, pathname: checkForModalMatch(location.pathname, role) }

  return (
    <Switch>
      <Route path="/project/:id/code" component={Coding} />
      <Route path="/project/:id/validate" component={Validation} />
      <HeaderedLayout>
        <Switch location={currentLocation}>
          <Route path="/admin" component={Admin} />
          <Route strict path="/project/:id/coding-scheme" component={CodingScheme} />
          <Route strict path="/project/:id/protocol" component={Protocol} />
          <Route path="/home" component={Home} />
          <Route exact path="/" render={() => <Redirect to={{ pathname: 'home' }} />} />
        </Switch>
        <Route path="/project/edit/:id" component={AddEditProject} />
        <Route path="/project/add" component={AddEditProject} />
        <Route path="/project/:id/jurisdictions" component={AddEditJurisdictions} />
        <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
        <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
      </HeaderedLayout>
    </Switch>
  )
}

const Scenes = props => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <PersistGate persistor={persistor}>
        <AuthenticatedRoute component={AuthenticatedScenes} />
      </PersistGate>
    </Switch>
  )
}

export default Scenes
