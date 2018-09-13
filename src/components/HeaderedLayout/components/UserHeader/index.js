import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Greeting from './components/Greeting'
import AvatarMenu from './components/AvatarMenu'
import theme from 'services/theme'

export const UserHeader = props => {
  const {
    user, open, handleLogoutUser, handleCloseMenu, handleOpenAdminPage, handleToggleMenu, handleOpenHelpPdf
  } = props

  const initials = user.firstName === 'Admin' ? 'A' : user.firstName[0] + user.lastName[0]

  return (
    <Grid container type="row" align="center">
      <Grid padding={8}>
        <Greeting firstName={user.firstName} lastName={user.lastName} role={user.role} />
      </Grid>
      <AvatarMenu
        initials={initials}
        userName={`${user.firstName} ${user.lastName}`}
        role={user.role}
        open={open}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={handleCloseMenu}
        onOpenAdminPage={handleOpenAdminPage}
        onLogoutUser={handleLogoutUser}
        onOpenHelpPdf={handleOpenHelpPdf}
        avatar={user.avatar}
      />
    </Grid>
  )
}

UserHeader.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool,
  handleLogoutUser: PropTypes.func,
  handleCloseMenu: PropTypes.func,
  handleOpenMenu: PropTypes.func
}

UserHeader.defaultProps = {
  open: false,
  user: {}
}

export default UserHeader