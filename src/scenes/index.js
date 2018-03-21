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
import Validation from './Validation'
import Protocol from './Protocol'
import { Authorization } from 'components/AuthorizedRoute'
import PageNotFound from 'components/PageNotFound'

const Coordinator = Authorization(['Admin', 'Coordinator'])
const AdminRole = Authorization(['Admin'])
const AllRoles = Authorization(['Admin', 'Coordinator', 'Coder'])

const AuthenticatedScenes = ({ match, location }) => (
  <Switch>
    <Route path="/project/:id/code" component={AllRoles(Coding)} />
    <Route path="/project/:id/validate" component={Coordinator(Validation)} />
    <HeaderedLayout>
      <Switch>
        <Route path="/admin" component={AdminRole(Admin)} />
        <Route strict path="/project/:id/coding-scheme" component={Coordinator(CodingScheme)} />
        <Route exact strict path="/project/:id/protocol" component={AllRoles(Protocol)} />
        <Route path="/" component={Home} />
        <Route component={PageNotFound} />
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
        <AuthenticatedRoute component={AuthenticatedScenes} />
      </PersistGate>
    </Switch>
  )
}

export default Scenes
