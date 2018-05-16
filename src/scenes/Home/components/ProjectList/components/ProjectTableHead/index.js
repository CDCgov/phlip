import React from 'react'
import PropTypes from 'prop-types'
import { TableSortLabel } from 'material-ui/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import IconButton from 'components/IconButton'
import Tooltip from 'components/Tooltip'

const columns = [
  { key: 'name', label: 'Name', hasSort: true, style: { paddingRight: 24, width: '15%' } },
  { key: 'dateLastEdited', label: 'Date Last Edited', hasSort: true, style: { paddingRight: 24 } },
  { key: 'lastEditedBy', label: 'Last Edited By', hasSort: true, style: { paddingRight: 24 } },
  { key: 'protocol', label: 'Protocol', hasSort: false, style: { textAlign: 'center', paddingRight: 24 } },
  { key: 'jurisdictions', label: 'Jurisdictions', hasSort: false, style: { textAlign: 'center', paddingRight: 24 } },
  { key: 'codingScheme', label: 'Coding Scheme', hasSort: false, style: { textAlign: 'center', paddingRight: 24 } },
  { key: 'code', label: '', hasSort: false, padding: 'checkbox', style: { width: 56, paddingRight: 6 } },
  { key: 'validate', label: '', hasSort: false, padding: 'checkbox', style: { width: 56, paddingLeft: 6 } },
  {
    key: 'export',
    label: 'Export',
    hasSort: false,
    style: { paddingRight: 24, paddingLeft: 0, textAlign: 'center', width: 40, width: '1%' }
  }
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
      <TableCell key="bookmarked" padding="checkbox" id="bookmarked" style={{ width: 24, paddingLeft: 24 }}>
        <IconButton
          id="sort-bookmarked"
          color="#757575"
          onClick={() => onSortBookmarked()}
          aria-label="Sort bookmarked"
          placement="top-start"
          tooltipText="Sort bookmarked">
          {sortBookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </TableCell>

      {visible.map(c => (
        <TableCell key={c.key} id={c.key} padding={c.padding || 'default'} style={{ ...c.style }}>
          {c.hasSort ? (
            <Tooltip
              text={`Sort by ${c.label}`}
              id={`sort-by-${c.key}`}
              aria-label={`Sort by ${c.label}`}>
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
