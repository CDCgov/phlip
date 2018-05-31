import React from 'react'
import PropTypes from 'prop-types'
import { TableRow as MuiTableRow } from 'material-ui/Table'

/**
 * Simple wrapper for material-ui's TableRow component
 */
export const TableRow = ({ children, ...otherProps }) => {
  return (
    <MuiTableRow {...otherProps}>
      {children}
    </MuiTableRow>
  )
}

TableRow.propTypes = {
  /**
   * Contents of table row, most likely TableCell components
   */
  children: PropTypes.node
}

export default TableRow