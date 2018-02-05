import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiMenu, MenuItem } from 'material-ui/Menu'

const Menu = ({ open, anchorEl, id, onRequestClose, items, ...otherProps }) => {
  return (
    <MuiMenu
      open={open}
      anchorEl={anchorEl}
      id={id}
      onRequestClose={onRequestClose}
      {...otherProps}
    >
      {items.map(item => (
        <MenuItem onClick={item.onClick} key={item.key}>
          {item.label}
        </MenuItem>
      ))}
    </MuiMenu>
  )
}

Menu.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  onRequestClose: PropTypes.func,
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
