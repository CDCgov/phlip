import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Avatar from 'components/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import TextLink from 'components/TextLink'

const AvatarMenu = ({ initials, onToggleMenu, onCloseMenu, onLogoutUser, menuAnchor, open }) => {
  return (
    <Grid item>
      <Avatar big onClick={onToggleMenu} initials={initials ? initials : ''} />
      <Menu
        id="avatar-menu"
        onRequestClose={onCloseMenu}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        getContentAnchorEl={null}
        open={open}
      >
        <MenuItem onClick={onLogoutUser} key="logout-menu">
          <TextLink to="login">Logout</TextLink>
        </MenuItem>
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