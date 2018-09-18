import React from 'react'
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
    padding: '0 30px 0 0',
    height: 55,
    maxHeight: 55,
    minHeight: 55
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

AppHeader.propTypes = {
  tabs: PropTypes.array,
  open: PropTypes.bool,
  user: PropTypes.object,
  onDownloadPdf: PropTypes.func,
  onLogoutUser: PropTypes.func,
  onOpenAdminPage: PropTypes.func,
  onToggleMenu: PropTypes.func,
  onTabChange: PropTypes.func
}

export default AppHeader