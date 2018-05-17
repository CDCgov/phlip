import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import AppBarHeader from './components/AppBarHeader'
import * as actions from 'data/user/actions'
import { withRouter } from 'react-router-dom'
import ApiErrorAlert from 'components/ApiErrorAlert'

export class HeaderedLayout extends Component {
  constructor(props, context) {
    super(props, context)
    this.helpPdfRef = null
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pdfFile === null && nextProps.pdfFile !== null) {
      this.openHelpPdf(nextProps.pdfFile)
    }
  }

  handleSetPdfRef = element => {
    this.helpPdfRef = element
  }

  handleDownloadPdf = () => {
    this.props.actions.downloadPdfRequest()
  }

  openHelpPdf = pdfFile => {
    const url = URL.createObjectURL(pdfFile)
    this.helpPdfRef.href = url
    this.helpPdfRef.download = 'PHLIP-Help-Guide.pdf'
    this.helpPdfRef.click()
    this.props.actions.clearPdfFile()
  }

  closeDownloadErrorAlert = () => {
    this.props.actions.resetDownloadError()
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
          handleOpenHelpPdf={this.handleDownloadPdf}
        />
        <Grid container spacing={0} style={mainStyles}>
          <ApiErrorAlert
            content={this.props.pdfError}
            open={this.props.pdfError !== ''}
            onCloseAlert={this.closeDownloadErrorAlert}
          />
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

const mapStateToProps = state => ({
  user: state.data.user.currentUser || { firstName: '', lastName: '', role: '' },
  open: state.data.user.menuOpen || false,
  pdfError: state.data.user.pdfError || '',
  pdfFile: state.data.user.pdfFile || null
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderedLayout))
