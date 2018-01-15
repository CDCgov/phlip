import React from 'react'
import PropTypes from 'prop-types'
import { TableSortLabel } from 'material-ui/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'

const columns = [
  { key: 'lastName', label: 'Name', style: { maxWidth: 10 }, hasSort: true },
  { key: 'email', label: 'Email', style: { maxWidth: 10 }, hasSort: false },
  { key: 'role', label: 'Role', style: { maxWidth: 10 }, hasSort: true },
  { key: 'edit', label: '', style: { maxWidth: 10 }, hasSort: false }
]

const UserTableHead = ({ onRequestSort, sortBy, direction }) => {
  return (
    <TableRow key="headers">
      {columns.map(c => (
        <TableCell key={c.key} style={{ ...c.style }} padding="default">
          {c.hasSort ? (
            <TableSortLabel active={sortBy === c.key} style={{ color: 'inherit' }}  direction={direction} onClick={onRequestSort(c.key)}>
              {c.label}
            </TableSortLabel>
          ) : c.label}
        </TableCell>
      ))}
    </TableRow>
  )
}

UserTableHead.propTypes = {
  onRequestSort: PropTypes.func,
  sortBy: PropTypes.string,
  direction: PropTypes.string
}

export default UserTableHead