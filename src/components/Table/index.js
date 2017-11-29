import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTable } from 'material-ui/Table'

const Table = ({ children, ...otherProps }) => {
  return (
    <MuiTable {...otherProps}>
      {children}
    </MuiTable>
  )
}

Table.propTypes = {
  children: PropTypes.node,
}

export default Table