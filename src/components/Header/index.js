import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import Greeting from './components/Greeting'
import AvatarMenu from './components/AvatarMenu'
import { Link } from 'react-router-dom'

export const Header = ({ theme, user, open, handleLogoutUser, handleCloseMenu, handleOpenAdminPage, handleToggleMenu }) => {
  const bgColor = theme.palette.primary['600']

  const styles = {
    height: '55px',
    backgroundColor: bgColor,
    padding: '0 30px'
  }

  const initials = user.firstName === 'Admin' ? 'A' : user.firstName[0] + user.lastName[0]

  return (
    <Grid container spacing={0} alignItems="center" style={styles}>
      <Grid item xs>
        <Link style={{ textDecoration: 'none' }} to="/"><Logo fontSize="30px" /></Link>
      </Grid>
      <Grid item>
        <Grid container spacing={8} alignItems="center">
          <Grid item>
            <Greeting firstName={user.firstName} lastName={user.lastName} role={user.role} />
          </Grid>
          <AvatarMenu
            initials={initials}
            role={user.role}
            open={open}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={handleCloseMenu}
            onOpenAdminPage={handleOpenAdminPage}
            onLogoutUser={handleLogoutUser}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  theme: PropTypes.object.isRequired,
  user: PropTypes.object,
  open: PropTypes.bool,
  menuAnchor: PropTypes.any,
  handleLogoutUser: PropTypes.func,
  handleCloseMenu: PropTypes.func,
  handleOpenMenu: PropTypes.func
}

Header.defaultProps = {
  open: false,
  user: {}
}

export default withTheme()(Header)