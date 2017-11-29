import React from 'react'
import PropTypes from 'prop-types'
import { TableRow as MuiTableRow } from 'material-ui/Table'

const TableRow = ({ children, ...otherProps }) => {
  return (
    <MuiTableRow {...otherProps}>
      {children}
    </MuiTableRow>
  )
}

TableRow.propTypes = {
  children: PropTypes.node
}

export default TableRow