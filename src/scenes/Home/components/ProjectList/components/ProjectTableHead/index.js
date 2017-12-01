import React from 'react'
import PropTypes from 'prop-types'
import { TableSortLabel } from 'material-ui/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import IconButton from 'components/IconButton'

const columns = [
  { key: 'name', label: 'Name', style: { textAlign: 'left', maxWidth: 'unset' }, hasSort: true },
  { key: 'dateLastEdited', label: 'Date Last Edited', style: { width: 150, maxWidth: 150, textAlign: 'unset' }, hasSort: true },
  { key: 'lastEditedBy', label: 'Last Edited By', style: { width: 150, maxWidth: 150, textAlign: 'unset' }, hasSort: true },
  { key: 'protocol', label: 'Protocol', hasSort: false },
  { key: 'jurisdictions', label: 'Jurisdictions', hasSort: false },
  { key: 'codingScheme', label: 'Coding Scheme', hasSort: false },
  { key: 'code', label: '', style: { maxWidth: 40 }, hasSort: false },
  { key: 'validate', label: '', style: { maxWidth: 40 }, hasSort: false },
  { key: 'export', label: 'Export', style: { maxWidth: 10 }, hasSort: false }
]

const hiddenCols = [
  'jurisdictions',
  'codingScheme',
  'validate'
]

const ProjectTableHead = ({ role, onRequestSort, sortBy, direction, sortBookmarked, onSortBookmarked }) => {
  const visible = (role === 'Coder' ? columns.filter(c => !hiddenCols.includes(c.key)) : columns)
  return (
    <TableRow key="headers">
      <TableCell key="bookmarked" style={{ width: 48 }}>
        <IconButton color="rbg(0,0,0,0.54)" onClick={onSortBookmarked}>
          { sortBookmarked ? 'bookmark' : 'bookmark_border' }
        </IconButton>
      </TableCell>

      {visible.map(c => (
        <TableCell key={c.key} style={c.style}>
          {c.hasSort ? (
            <TableSortLabel active={sortBy === c.key} direction={direction} onClick={onRequestSort(c.key)}>
              {c.label}
            </TableSortLabel>
          ) : c.label}
        </TableCell>
      ))}
    </TableRow>
  )
}

ProjectTableHead.propTypes = {
  role: PropTypes.string,
  onRequestSort: PropTypes.func,
  sortBy: PropTypes.string,
  direction: PropTypes.string
}

export default ProjectTableHead
