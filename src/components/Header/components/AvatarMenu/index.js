import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Avatar from 'components/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
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
          <TextLink to="login">Logout</TextLink>
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
  initials: PropTypes.string,
  open: PropTypes.bool,
  onToggleMenu: PropTypes.func
}

AvatarMenu.defaultProps = {
  open: false
}

export default AvatarMenu