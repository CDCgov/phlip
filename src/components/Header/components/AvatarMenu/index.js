import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Avatar from 'components/Avatar'
import Menu from 'components/Menu'

const AvatarMenu = ({ initials, onToggleMenu, onCloseMenu, onLogoutUser, menuAnchor, open }) => {
  const items = [
    { label: 'Logout', onClick: onLogoutUser, key: 'logout-menu' }
  ]

  return (
    <Grid item>
      <Avatar big onClick={onToggleMenu} initials={initials ? initials : ''} />
      <Menu
        id="avatar-menu"
        onRequestClose={onCloseMenu}
        items={items}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        getContentAnchorEl={null}
        open={open}
      />
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