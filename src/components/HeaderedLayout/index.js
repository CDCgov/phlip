import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Logo from 'components/Logo'
import HeaderTabs from './components/HeaderTabs'
import UserHeader from './components/UserHeader'
import theme from 'services/theme'

export const AppHeader = props => {
  const { user, tabs, onLogoutUser, onDownloadPdf, onToggleMenu, onOpenAdminPage, onTabChange, open } = props

  const headerStyle = {
    backgroundColor: 'white',
    borderRadius: 0,
    position: 'relative',
    boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
    backgroundColor: theme.palette.primary.main,
    padding: '0 30px 0 0'
  }

  return (
    <Grid container align="center" justify="space-between" type="row" style={headerStyle}>
      <HeaderTabs tabs={tabs} onTabChange={onTabChange} />
      <Grid>
        <Logo height={35} />
      </Grid>
      <UserHeader
        user={user}
        open={open}
        handleLogoutUser={onLogoutUser}
        handleToggleMenu={() => onToggleMenu(!open)}
        handleOpenAdminPage={onOpenAdminPage}
        handleCloseMenu={() => onToggleMenu(false)}
        handleOpenHelpPdf={onDownloadPdf}
        handleTabChange={onTabChange}
      />
    </Grid>
  )
}

AppHeader.propTypes = {}

export default AppHeader

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
}