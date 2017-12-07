import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import Header from 'components/Header'
import * as actions from 'scenes/Login/actions'

const mainStyles = {
  backgroundColor: '#f5f5f5',
  padding: '0 27px 37px 27px',
  flex: '1'
}

const AuthenticatedLayout = ({ user, children, actions }) => {
  return (
    <Grid container spacing={0} direction="column" style={{ flex: '1' }}>
      <Header user={user} logout={actions.logoutUser} />
      <Grid container spacing={0} style={mainStyles}>
        {children}
      </Grid>
    </Grid>
    )
}

AuthenticatedLayout.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
}

const mapStateToProps = (state, props) => ({
  children: props.children,
  user: state.data.user.currentUser || {firstName: '', lastName: '', role: ''}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedLayout)
