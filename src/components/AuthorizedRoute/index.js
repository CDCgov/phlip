import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PageNotFound from 'components/PageNotFound'
import { matchPath } from 'react-router'

export const Authorization = allowedRoles => WrappedComponent => {
  class WithAuthorization extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      if (allowedRoles.includes(this.props.user.role)) {
        return <WrappedComponent {...this.props} />
      } else {
        return <PageNotFound />
      }
    }
  }

  return connect(state => ({ user: state.data.user.currentUser }))(WithAuthorization)
}