import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiMenu, MenuItem } from 'material-ui/Menu'

/**
 * Displays a menu of menuitems as a popover - wrapper for material-ui's Menu component
 */
export const Menu = ({ open, anchorEl, id, onRequestClose, items, ...otherProps }) => {
  return (
    <MuiMenu
      open={open}
      anchorEl={anchorEl}
      id={id}
      onRequestClose={onRequestClose}
      {...otherProps}>
      {items.map(item => (
        <MenuItem onClick={item.onClick} key={item.key}>
          {item.label}
        </MenuItem>
      ))}
    </MuiMenu>
  )
}

Menu.propTypes = {
  /**
   * Is the menu open
   */
  open: PropTypes.bool,
  /**
   * Anchor element for the menu popover
   */
  anchorEl: PropTypes.any,
  /**
   * ID of the menu list
   */
  id: PropTypes.string,
  /**
   * Function to call when the menu is closed
   */
  onRequestClose: PropTypes.func,
  /**
   * The items to display in the menu
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    key: PropTypes.any
  }))
}

Menu.defaultProps = {
  open: false
}

export default Menu
