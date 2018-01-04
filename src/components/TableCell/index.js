import React from 'react'
import PropTypes from 'prop-types'
import { TableCell as MuiTableCell } from 'material-ui/Table'

const baseStyle = {
  textAlign: 'center'
}

const TableCell = ({ style, light, children, ...otherProps }) => {
  return (
    <MuiTableCell padding="checkbox" style={{...baseStyle, ...style }} {...otherProps}>
      {children}
    </MuiTableCell>
  )
}

TableCell.propTypes = {
  style: PropTypes.object,
  light: PropTypes.bool,
  children: PropTypes.node
}

export default TableCell
