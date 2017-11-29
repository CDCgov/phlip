import React from 'react'
import PropTypes from 'prop-types'
import Table, { TableHead, TableBody } from 'material-ui/Table'
import TableRow from '../TableRow'
import TableCell from '../TableCell'

const baseStyle = {
  fontWeight: 'normal',
  textAlign: 'center'
}

const ListTable = ({ children, headers, style }) => {
  return (
    <Table>
      <TableHead>
        <TableRow key="headers">
          {headers.map((header, index) => (
            <TableCell key={header.id} style={{ ...baseStyle, ...style}}>
              {header.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  )
}

ListTable.propTypes = {
  children: PropTypes.node,
  headers: PropTypes.arrayOf(PropTypes.object)
}

export default ListTable