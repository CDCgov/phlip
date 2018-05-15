import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { isLoggedInTokenExists, isTokenExpired } from 'services/authToken'
import { connect } from 'react-redux'
import { UnauthPage, PageNotFound } from 'components/RoutePages'

const coderPaths = ['/home', '/project/:id/protocol', '/project/:id/code', '/project/edit/:id']
const coordinatorPaths = [
  ...coderPaths, '/project/add', '/project/:id/jurisdictions', '/project/:id/coding-scheme', '/project/:id/validate'
]
const adminPaths = [...coderPaths, ...coordinatorPaths, '/admin']

const paths = {
  Coder: coderPaths,
  Coordinator: coordinatorPaths,
  Admin: adminPaths
}

const isAllowed = (user, path) => {
  if (path === '/') return true
  const allowedPaths = paths[user.role]
  let allowed = true
  if (allowedPaths.length > 0) {
    allowed = false
    allowedPaths.forEach(pathname => {
      const match = matchPath(path, { path: pathname })
      if (match !== null) allowed = true
    })
    return allowed
  }
  return allowed
}

const isPath = path => {
  if (path === '/') return true
  let isPath = false
  adminPaths.forEach(pathname => {
    const match = matchPath(path, { path: pathname })
    if (match !== null) isPath = true
  })
  return isPath
}

/**
 * A wrapper around all other routes that handles whether or not the user can view the page. If they are allowed then it
 * renders the component, if not, then renders UnauthPage. If page isn't found, it renders PageNotFound. If the user isn't
 * logged in, renders the Login page.
 */
export const AuthenticatedRoute = ({ component: Component, user, location, ...rest }) => {
  return (
    isPath(location.pathname)
      ? isLoggedInTokenExists()
        ? isAllowed(user, location.pathname)
          ? <Route {...rest} render={props => <Component {...props} location={location} role={user.role} />} />
          : <UnauthPage />
        : <Route {...rest} render={() => <Redirect to="/login" {...rest} />} />
      : <PageNotFound />
  )
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
}

export default withRouter(connect(state => ({ user: state.data.user.currentUser }))(AuthenticatedRoute))