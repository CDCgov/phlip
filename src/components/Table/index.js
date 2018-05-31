import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTable } from 'material-ui/Table'

/**
 * Wrapper for material-ui's Table component
 */
export const Table = ({ children, ...otherProps }) => {
  return (
    <MuiTable {...otherProps}>
      {children}
    </MuiTable>
  )
}

Table.propTypes = {
  /**
   * Contents of table, will be TableHead, TableBody, etc.
   */
  children: PropTypes.node,
}

export default Table