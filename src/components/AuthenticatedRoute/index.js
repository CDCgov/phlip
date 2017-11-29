import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedInTokenExists } from '../../services/authToken'

// const isLoggedIn = () => true
const isLoggedIn = () => isLoggedInTokenExists() //TODO: turn on later

export default function AuthenticatedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn() ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/login',
              }}
            />
          )}
    />
  )
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
}