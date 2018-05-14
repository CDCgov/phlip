import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import Grid from 'material-ui/Grid'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import { MenuItem, MenuList } from 'material-ui/Menu'
import Grow from 'material-ui/transitions/Grow'
import Paper from 'material-ui/Paper'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'

export class AvatarMenu extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.firstMenuItem = null
    this.secondMenuItem = null
  }

  setFirstMenuItem = element => {
    this.firstMenuItem = findDOMNode(element)
  }

  setSecondMenuItem = element => {
    this.secondMenuItem = findDOMNode(element)
  }

  onKeyPressMenu = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this.props.onToggleMenu()
      this.props.role === 'Admin' ? this.firstMenuItem.focus() : this.secondMenuItem.focus()
    }
  }

  render() {
    const {
      role, initials, open, onCloseMenu, onLogoutUser, onOpenAdminPage, onToggleMenu, onOpenHelpPdf, avatar
    } = this.props

    return (
      <Grid item style={{ zIndex: 2 }}>
        <Manager>
          <Target>
            <Avatar
              id="avatar-menu-button"
              onClick={onToggleMenu}
              onKeyPress={this.onKeyPressMenu}
              role="menubutton"
              tabIndex={0}
              aria-controls="avatar-menu"
              aria-haspopup={true}
              aria-owns={open ? 'avatar-user-menu' : null}
              avatar={avatar}
              initials={initials ? initials : ''}
              style={{ cursor: 'pointer' }} />
          </Target>
          <Popper placement="bottom-end" eventsEnabled={open} style={{ pointerEvents: open ? 'auto' : 'none' }}>
            <ClickAwayListener onClickAway={onCloseMenu}>
              <Grow in={open} id="avatar-menu">
                <Paper style={{ marginTop: 5 }}>
                  <MenuList role="menu" aria-expanded={open} id="avatar-user-menu" aria-labelledby="avatar-menu-button">
                    {role === 'Admin' &&
                    <MenuItem onClick={onOpenAdminPage} selected={false} key="admin-menu" ref={this.setFirstMenuItem}>
                      <ListItemIcon>
                        <Icon color="accent">person</Icon>
                      </ListItemIcon>
                      <ListItemText style={{ color: '#5f6060' }} disableTypography primary="User Management" />
                    </MenuItem>}
                    <MenuItem onClick={onLogoutUser} key="logout-menu" ref={this.setSecondMenuItem}>
                      <ListItemIcon>
                        <Icon color="accent">exit_to_app</Icon>
                      </ListItemIcon>
                      <ListItemText style={{ color: '#5f6060' }} disableTypography primary="Logout" />
                    </MenuItem>
                    <MenuItem onClick={onOpenHelpPdf} key="help-section-pdf">
                      <ListItemIcon>
                        <Icon color="accent">help</Icon>
                      </ListItemIcon>
                      <ListItemText style={{ color: '#5f6060' }} disableTypography primary="Help" />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </Grid>
    )
  }
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