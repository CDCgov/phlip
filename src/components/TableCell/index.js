import React from 'react'
import PropTypes from 'prop-types'
import { TableCell as MuiTableCell } from 'material-ui/Table'

/**
 * Wrapper for material-ui's TableCell component
 */
export const TableCell = ({ style, padding, children, ...otherProps }) => {
  return (
    <MuiTableCell padding={padding} style={{ ...style, minWidth: '1%' }} {...otherProps}>
      {children}
    </MuiTableCell>
  )
}

TableCell.propTypes = {
  /**
   * Override style of table cell
   */
  style: PropTypes.object,
  /**
   * Contents of table cell
   */
  children: PropTypes.node,
  /**
   * How much padding to add to table cell, based on material-ui's options
   */
  padding: PropTypes.string
}

TableCell.defaultProps = {
  padding: 'default'
}


export default TableCell
