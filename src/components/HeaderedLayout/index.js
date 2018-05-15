import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import AppBarHeader from './components/AppBarHeader'
import * as actions from 'data/user/actions'
import { withRouter } from 'react-router-dom'
import { api } from 'services/store'

export class HeaderedLayout extends Component {
  constructor(props, context) {
    super(props, context)
    this.helpPdfRef = null
  }

  handleSetPdfRef = element => {
    this.helpPdfRef = element
  }

  openHelpPdf = async () => {
    this.props.actions.closeMenu()
    const data = await api.getHelpPdf({}, { responseType: 'arraybuffer' }, {})
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    this.helpPdfRef.href = url
    this.helpPdfRef.download = 'PHLIP-Help-Guide.pdf'
    this.helpPdfRef.click()
    //window.URL.revokeObjectURL(url)
  }

  render() {
    const { user, open, actions, children, padding, history, className } = this.props
    const mainStyles = {
      backgroundColor: '#f5f5f5',
      padding: padding ? '0 27px 10px 27px' : '',
      flex: '1'
    }

    return (
      <Grid container spacing={0} direction="column" style={{ flex: '1' }} className={className}>
        <AppBarHeader
          user={user}
          open={open}
          handleLogoutUser={() => { history.push('/login'); actions.logoutUser() }}
          handleToggleMenu={actions.toggleMenu}
          handleOpenAdminPage={() => { history.push('/admin'); actions.closeMenu() }}
          handleCloseMenu={actions.closeMenu}
          handleOpenHelpPdf={this.openHelpPdf}
        />
        <Grid container spacing={0} style={mainStyles}>
          {children}
        </Grid>
        <a style={{ display: 'none' }} ref={this.handleSetPdfRef} />
      </Grid>
    )
  }
}

HeaderedLayout.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool,
  actions: PropTypes.object,
  children: PropTypes.node
}

HeaderedLayout.defaultProps = {
  padding: true
}

const mapStateToProps = (state, props) => ({
  user: state.data.user.currentUser || { firstName: '', lastName: '', role: '' },
  open: state.data.user.menuOpen || false
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderedLayout))
