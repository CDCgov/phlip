import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import { bindActionCreators } from 'redux'
import Home from './Home'
import DocumentManagement from './DocumentManagement'
import HeaderedLayout from 'components/HeaderedLayout'
import Coding from './Coding'
import Validation from './Validation'
import Admin from './Admin'
import CodingScheme from './CodingScheme'
import Protocol from './Protocol'
import AddEditProject from './Home/scenes/AddEditProject'
import AddEditJurisdictions from './Home/scenes/AddEditJurisdictions'
import JurisdictionForm from './Home/scenes/AddEditJurisdictions/components/JurisdictionForm'
import IdleTimer from 'react-idle-timer'

/** Paths that aren't accessible by users with 'Coder' role */
const nonCoderPaths = [
  '/project/add',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

const modalPath = '/project/edit/:id'

const isActive = (history, locations) => {
  return locations.includes(history.location.pathname)
}

/**
 * Main scenes component for views that require a login (i.e. everything but the Login view). All of the react-router
 * routes are set here.
 *
 * @param match
 * @param location
 * @param role
 * @param otherProps
 * @param dispatch
 * @param isRefreshing
 * @returns {*}
 * @constructor
 */
class Main extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      menuTabs: [
        {
          label: 'Project List',
          active: !props.history.location.pathname.startsWith('/docs'),
          location: '/home',
          icon: 'dvr'
        },
        {
          label: 'Document Management',
          active: props.history.location.pathname.startsWith('/docs'),
          location: '/docs',
          icon: 'description'
        }
      ]
    }
  }

  /**
   * Checks if the route path is a modal view.
   *
   * @param pathname
   * @param role
   * @returns {Object}
   */
  checkForModalMatch = (pathname, role) => {
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

  handleMenuChange = index => {
    const newLocation = this.state.menuTabs[index].location
    this.props.history.push(newLocation)
    this.setState({
      menuTabs: this.state.menuTabs.map((tab, i) => ({
        ...tab,
        active: index === i
      }))
    })
  }

  handleLogoutUser = () => {
    this.props.actions.logoutUser()
    this.props.history.push('/login')
  }

  render() {
    const { match, location, role, actions, isRefreshing, isLoggedIn, ...otherProps } = this.props

    // This is for jurisdictions / add/edit project modals. We want the modals to be displayed on top of the home screen,
    // so we check if it's one of those routes and if it is set the location to /home
    const currentLocation = { ...location, pathname: this.checkForModalMatch(location.pathname, role) }
    if (!isRefreshing && isLoggedIn) actions.startRefreshJwt()

    return (
      <IdleTimer idleAction={() => actions.logoutUser(true)} timeout={900000}>
        <HeaderedLayout
          onLogoutUser={this.handleLogoutUser}
          user={this.props.user}
          tabs={this.state.menuTabs}
          onMenuChange={this.handleMenuChange}>
          <Switch location={currentLocation}>
            <Route path="/docs" exact component={DocumentManagement} />
            <Route path="/project/:id/code" component={Coding} />
            <Route path="/project/:id/validate" component={Validation} />
            <Route path="/admin" component={Admin} />
            <Route strict path="/project/:id/coding-scheme" component={CodingScheme} />
            <Route strict path="/project/:id/protocol" component={Protocol} />
            <Route path="/home" component={Home} />
            <Route path="/project/edit/:id" component={AddEditProject} />
            <Route path="/project/add" component={AddEditProject} />
            <Route path="/project/:id/jurisdictions" component={AddEditJurisdictions} />
            <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
            <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
            <Route path="/" exact render={() => <Redirect to={{ pathname: '/home' }} />} />
          </Switch>
        </HeaderedLayout>
      </IdleTimer>
    )
  }
}

export default Main