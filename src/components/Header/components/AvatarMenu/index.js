import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Menu, { MenuItem } from 'material-ui/Menu'
import Typography from 'material-ui/Typography'
import Avatar from 'components/Avatar'
import TextLink from 'components/TextLink'

export const AvatarMenu = ({ role, initials, menuAnchor, open, onCloseMenu, onLogoutUser, onOpenMenu }) => {
  return (
    <Grid item>
      <Avatar big onClick={onOpenMenu} initials={initials ? initials : ''} style={{ cursor: 'pointer' }} />
      <Menu
        id="avatar-menu"
        onRequestClose={onCloseMenu}
        anchorEl={menuAnchor}
        marginThreshold={30}
        MenuListProps={{
          disablePadding: true
        }}
        open={open}
      >
        <MenuItem onClick={onLogoutUser} key="logout-menu">
          <Typography color="primary" style={{ fontSize: '1rem' }}>Logout</Typography>
        </MenuItem>
        {role === 'Admin' &&
          <MenuItem onClick={onCloseMenu} key="admin-menu">
            <TextLink to="admin">Admin</TextLink>
          </MenuItem>
        }
      </Menu>
    </Grid>
  )
}

AvatarMenu.propTypes = {
  role: PropTypes.string,
  initials: PropTypes.string,
  menuAnchor: PropTypes.any,
  open: PropTypes.bool,
  onCloseMenu: PropTypes.func,
  onLogoutUser: PropTypes.func,
  onOpenMenu: PropTypes.func
}

AvatarMenu.defaultProps = {
  open: false
}

export default AvatarMenu