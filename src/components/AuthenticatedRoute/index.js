import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedInTokenExists } from 'services/authToken'

export default function AuthenticatedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedInTokenExists() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  )
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
}