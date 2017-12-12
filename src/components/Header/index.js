import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import Greeting from './components/Greeting'
import AvatarMenu from './components/AvatarMenu'
import { Link } from 'react-router-dom'

export const Header = ({ theme, user, open, menuAnchor, onLogoutUser, onToggleMenu, onCloseMenu }) => {
  const bgColor = theme.palette.primary['600']

  const styles = {
    height: '100px',
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
            menuAnchor={menuAnchor}
            onToggleMenu={event => onToggleMenu(event.currentTarget) }
            onCloseMenu={onCloseMenu}
            onLogoutUser={onLogoutUser}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  theme: PropTypes.object.isRequired,
  user: PropTypes.object,
  onLogoutUser: PropTypes.func,
  onToggleMenu: PropTypes.func
}

export default withTheme()(Header)