import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Typography from 'material-ui/Typography'
import Container from 'components/Layout'
import { EmoticonPoop } from 'mdi-material-ui'

export const Authorization = allowedRoles => WrappedComponent => {
  class WithAuthorization extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      const { user } = this.props
      if (allowedRoles.includes(user.role)) {
        return <WrappedComponent {...this.props} />
      } else {
        return <Container alignItems="center" style={{ justifyItems: 'center' }}>
          <Typography
            style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            type="display4"
            align="center">No page for you <EmoticonPoop style={{ width: 100, height: 100 }} /></Typography>

        </Container>
      }
    }
  }

  return connect(state => ({ user: state.data.user.currentUser }))(WithAuthorization)
}