import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import AppBarHeader from './components/AppBarHeader'
import * as actions from 'data/user/actions'
import { withRouter } from 'react-router-dom'
import ApiErrorAlert from 'components/ApiErrorAlert'

/**
 * This component is the main wrapper for all other components, it includes the logo header at the top of the
 * application which includes the avatar menu. The contents of the other components are render inside this container.
 */
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

  /**
   * Sets the ref for the hidden `<a>` element for downloading the Help Guide
   * @param element
   * @public
   */
  handleSetPdfRef = element => {
    this.helpPdfRef = element
  }

  /**
   * Handles when the user click 'Help Guide' in the avatar menu
   * @public
   */
  handleDownloadPdf = () => {
    this.props.actions.downloadPdfRequest()
  }

  /**
   * Creates an object url from the pdfFile and attaches the hidden `<a>` element to it
   * @public
   * @param pdfFile
   */
  openHelpPdf = pdfFile => {
    const url = URL.createObjectURL(pdfFile)
    this.helpPdfRef.href = url
    this.helpPdfRef.download = 'PHLIP-Help-Guide.pdf'
    this.helpPdfRef.click()
    this.props.actions.clearPdfFile()
  }

  /**
   * Closes the error alert when the user clicks 'dismiss'
   * @public
   */
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
          handleLogoutUser={() => { actions.closeMenu(); actions.logoutUser(); history.push('/login') }}
          handleToggleMenu={actions.toggleMenu}
          handleOpenAdminPage={() => { actions.closeMenu(); history.push('/admin') }}
          handleCloseMenu={actions.closeMenu}
          handleOpenHelpPdf={this.handleDownloadPdf}
        />
        <Grid container spacing={0} style={mainStyles} role="main">
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
  /**
   * Current user object (supplied from redux state)
   */
  user: PropTypes.object,

  /**
   * Whether or not the avatar menu is open
   */
  open: PropTypes.bool,

  /**
   * Whether to include padding around the main content body
   */
  padding: PropTypes.any,

  /**
   * Redux actions
   */
  actions: PropTypes.object,

  /**
   * Main body content
   */
  children: PropTypes.node,

  /**
   * Error, if any, that occurred while trying to download help guide pdf
   */
  pdfError: PropTypes.string,

  /**
   * Contents of the pdf file from the API
   */
  pdfFile: PropTypes.any
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
