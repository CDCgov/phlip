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
  { key: 'code', label: '', hasSort: false },
  { key: 'validate', label: '', hasSort: false },
  { key: 'export', label: '', hasSort: false }
]

const hiddenCols = [
  'jurisdictions',
  'codingScheme',
  'validate'
]

const ProjectTableHead = ({ role, sortBy, direction, sortBookmarked, onRequestSort, onSortBookmarked }) => {
  const visible = (role === 'Coder' ? columns.filter(c => !hiddenCols.includes(c.key)) : columns)
  return (
    <TableRow key="headers">
      <TableCell key="bookmarked" style={{ width: 48 }}>
        <IconButton color="rbg(0,0,0,0.54)" onClick={() => onSortBookmarked()}>
          { sortBookmarked ? 'bookmark' : 'bookmark_border' }
        </IconButton>
      </TableCell>

      {visible.map(c => (
        <TableCell key={c.key} style={{ ...c.style, color: 'black' }}>
          {c.hasSort ? (
            <TableSortLabel active={sortBy === c.key} direction={direction} onClick={() => onRequestSort(c.key)}>
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
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  sortBookmarked: PropTypes.bool,
  onRequestSort: PropTypes.func,
  onSortBookmarked: PropTypes.func
}

export default ProjectTableHead
