import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Avatar from 'components/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import TextLink from 'components/TextLink'

const AvatarMenu = ({ role, initials, onToggleMenu, onCloseMenu, onLogoutUser, menuAnchor, open }) => {
  return (
    <Grid item>
      <Avatar big onClick={onToggleMenu} initials={initials ? initials : ''} style={{ cursor: 'pointer' }} />
      <Menu
        id="avatar-menu"
        onRequestClose={onCloseMenu}
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        marginThreshold={30}
        open={open}
      >
        <MenuItem onClick={onLogoutUser} selected={false} key="logout-menu">
          <TextLink to="login">Logout</TextLink>
        </MenuItem>
        {role === 'Admin' &&
          <MenuItem onClick={onToggleMenu} key="admin-menu">
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