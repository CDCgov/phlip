import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import Grid from '@material-ui/core/Grid'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

export class AvatarMenu extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.firstMenuItem = null
    this.secondMenuItem = null
    this.avatarRef = null
  }

  setFirstMenuItem = element => {
    this.firstMenuItem = findDOMNode(element)
    if (this.props.role === 'Admin' && this.props.open && this.firstMenuItem !== null) {
      this.firstMenuItem.focus()
    }
  }

  setSecondMenuItem = element => {
    this.secondMenuItem = findDOMNode(element)
    if (this.props.role !== 'Admin' && this.props.open && this.secondMenuItem !== null) {
      this.secondMenuItem.focus()
    }
  }

  onKeyPressMenu = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this.props.onToggleMenu()
    }
  }

  handleClose = event => {
    if (!this.avatarRef.contains(event.target)) {
      this.props.onCloseMenu()
    }
  }

  setAvatarRef = element => {
    this.avatarRef = findDOMNode(element)
  }

  render() {
    const {
      role, initials, userName, open, onLogoutUser, onOpenAdminPage, onToggleMenu, onOpenHelpPdf, avatar
    } = this.props

    return (
      <Grid item style={{ zIndex: 2 }}>
        <Manager>
          <Target>
            <Avatar
              id="avatar-menu-button"
              onClick={onToggleMenu}
              onKeyPress={this.onKeyPressMenu}
              role="button"
              tabIndex={0}
              aria-controls="avatar-menu"
              aria-haspopup={true}
              aria-owns={open ? 'avatar-user-menu' : null}
              avatar={avatar}
              ref={this.setAvatarRef}
              userName={userName}
              initials={initials ? initials : ''}
              style={{ cursor: 'pointer' }} />
          </Target>
          <Popper placement="bottom-end" eventsEnabled={open} style={{ pointerEvents: open ? 'auto' : 'none' }}>
            {open && <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="avatar-menu">
                <Paper style={{ marginTop: 5 }}>
                  <MenuList role="menu" aria-expanded={open} id="avatar-user-menu" aria-labelledby="avatar-menu-button">
                    {role === 'Admin' &&
                    <MenuItem onClick={onOpenAdminPage} key="admin-menu" ref={this.setFirstMenuItem}>
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
            </ClickAwayListener>}
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