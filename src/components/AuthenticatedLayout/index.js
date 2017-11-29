import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid'
import Header from '../Header'

const mainStyles = {
  backgroundColor: '#f5f5f5',
  padding: '0 27px 37px 27px',
  flex: '1'
}

const AuthenticatedLayout = ({ user, children }) => {
  return (
    <Grid container spacing={0} direction="column" style={{ flex: '1' }}>
      <Header user={user} />
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

export default connect(mapStateToProps)(AuthenticatedLayout)
