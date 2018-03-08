import React from 'react'
import PropTypes from 'prop-types'
import { TableSortLabel } from 'material-ui/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import IconButton from 'components/IconButton'
import Tooltip from 'components/Tooltip'

const columns = [
  { key: 'name', label: 'Name', hasSort: true },
  { key: 'dateLastEdited', label: 'Date Last Edited', hasSort: true },
  { key: 'lastEditedBy', label: 'Last Edited By', hasSort: true },
  { key: 'protocol', label: 'Protocol', hasSort: false, style: { textAlign: 'center' } },
  { key: 'jurisdictions', label: 'Jurisdictions', hasSort: false, style: { textAlign: 'center' } },
  { key: 'codingScheme', label: 'Coding Scheme', hasSort: false, style: { textAlign: 'center' } },
  { key: 'code', label: '', hasSort: false },
  { key: 'validate', label: '', hasSort: false },
  { key: 'export', label: '', hasSort: false }
]

const hiddenCols = [
  'jurisdictions',
  'codingScheme',
  'validate',
  'export'
]

const ProjectTableHead = ({ role, sortBy, direction, sortBookmarked, onRequestSort, onSortBookmarked }) => {
  const visible = (role === 'Coder' ? columns.filter(c => !hiddenCols.includes(c.key)) : columns)

  return (
    <TableRow key="headers">
      <TableCell key="bookmarked" style={{ width: 48 }}>
        <IconButton id="sort-bookmarked" color="rbg(0,0,0,0.54)" onClick={() => onSortBookmarked()} tooltipText="Sort bookmarked">
          {sortBookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </TableCell>

      {visible.map(c => (
        <TableCell key={c.key} style={{ ...c.style }}>
          {c.hasSort ? (
            <Tooltip text={`Sort by ${c.label}`}>
            <TableSortLabel
              active={sortBy === c.key}
              style={{ color: 'inherit' }}
              direction={direction}
              onClick={() => onRequestSort(c.key)}>
              {c.label}
            </TableSortLabel>
            </Tooltip>
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
