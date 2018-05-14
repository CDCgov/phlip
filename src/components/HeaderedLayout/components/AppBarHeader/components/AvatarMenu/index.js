import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import { MenuItem, MenuList } from 'material-ui/Menu'
import Grow from 'material-ui/transitions/Grow'
import Paper from 'material-ui/Paper'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'

export const AvatarMenu = ({ role, initials, open, onCloseMenu, onLogoutUser, onOpenAdminPage, onToggleMenu, onOpenHelpPdf, avatar }) => {
  return (
    <ClickAwayListener onClickAway={open ? onCloseMenu : () => {}}>
      <Grid item style={{ zIndex: 2 }}>
        <Manager>
          <Target>
            <Avatar
              onClick={onToggleMenu}
              onKeyPress={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  onToggleMenu()
                }
              }}
              avatar={avatar}
              role="menubutton"
              tabIndex={0}
              initials={initials ? initials : ''}
              style={{ cursor: 'pointer' }} />
          </Target>
          {open &&
          <Popper placement="bottom-end" eventsEnabled={open}>
            <Grow in={open} id="avatar-menu">
              <Paper style={{ marginTop: 5 }}>
                <MenuList role="menu" aria-expanded={open}>
                  {role === 'Admin' &&
                  <MenuItem onClick={onOpenAdminPage} selected={false} key="admin-menu">
                    <ListItemIcon>
                      <Icon color="accent">person</Icon>
                    </ListItemIcon>
                    <ListItemText style={{ color: '#5f6060' }} disableTypography primary="User Management" />
                  </MenuItem>}
                  <MenuItem onClick={onLogoutUser} tabIndex={0} key="logout-menu">
                    <ListItemIcon>
                      <Icon color="accent">exit_to_app</Icon>
                    </ListItemIcon>
                    <ListItemText style={{ color: '#5f6060' }} disableTypography primary="Logout" />
                  </MenuItem>
                  <MenuItem onClick={onOpenHelpPdf} tabIndex={0} key="help-section-pdf">
                    <ListItemIcon>
                      <Icon color="accent">help</Icon>
                    </ListItemIcon>
                    <ListItemText style={{ color: '#5f6060' }} disableTypography primary="Help" />
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          </Popper>}
        </Manager>
      </Grid>
    </ClickAwayListener>
  )
}

AvatarMenu.propTypes = {
  role: PropTypes.string,
  initials: PropTypes.string,
  open: PropTypes.bool,
  onCloseMenu: PropTypes.func,
  onLogoutUser: PropTypes.func,
  onOpenMenu: PropTypes.func
}

AvatarMenu.defaultProps = {
  open: false
}

export default AvatarMenu