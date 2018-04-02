import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { UnauthPage } from 'components/RoutePages'

export const Authorization = allowedRoles => WrappedComponent => {
  class WithAuthorization extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      if (allowedRoles.includes(this.props.user.role)) {
        return <WrappedComponent {...this.props} />
      } else {
        return <WrappedComponent {...this.props} location={{...this.props.location, state: { unauthorized: true }}} />
      }
    }
  }

  return connect(state => ({ user: state.data.user.currentUser }))(WithAuthorization)
}