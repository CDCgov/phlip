import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import Header from 'components/Header'
import * as actions from 'data/user/actions'
import { withRouter } from 'react-router-dom'

const mainStyles = {
  backgroundColor: '#f5f5f5',
  padding: '0 27px 37px 27px',
  flex: '1'
}


export const HeaderedLayout = ({ user, open, actions, children, history }) => {
  return (
    <Grid container spacing={0} direction="column" style={{ flex: '1' }}>
      <Header
        user={user}
        open={open}
        handleLogoutUser={() => { history.push('/'); actions.logoutUser() }}
        handleToggleMenu={() => actions.toggleMenu()}
        handleOpenAdminPage={() => { history.push('/admin'); actions.toggleMenu() }}
        handleCloseMenu={() => actions.toggleMenu()}
      />
      <Grid container spacing={0} style={mainStyles}>
        {children}
      </Grid>
    </Grid>
  )
}

HeaderedLayout.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool,
  actions: PropTypes.object,
  menuAnchor: PropTypes.any,
  children: PropTypes.node
}

const mapStateToProps = (state, props) => ({
  user: state.data.user.currentUser || { firstName: '', lastName: '', role: '' },
  open: state.data.user.menuOpen || false,
  menuAnchor: state.data.user.menuAnchor || null
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderedLayout))
