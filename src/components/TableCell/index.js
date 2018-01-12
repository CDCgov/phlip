import React from 'react'
import PropTypes from 'prop-types'
import { TableCell as MuiTableCell } from 'material-ui/Table'

const TableCell = ({ style, padding, children, ...otherProps }) => {
  return (
    <MuiTableCell padding={padding} style={{ ...style }} {...otherProps}>
      {children}
    </MuiTableCell>
  )
}

TableCell.propTypes = {
  style: PropTypes.object,
  light: PropTypes.bool,
  children: PropTypes.node,
  padding: PropTypes.string
}

TableCell.defaultProps = {
  padding: 'checkbox'
}


export default TableCell
