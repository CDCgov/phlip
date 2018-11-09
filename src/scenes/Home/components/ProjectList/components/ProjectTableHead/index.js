import React from 'react'
import PropTypes from 'prop-types'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from 'components/IconButton'
import Tooltip from 'components/Tooltip'

const columns = [
  { key: 'name', label: 'Name', hasSort: true, padding: 'checkbox' },
  { key: 'dateLastEdited', label: 'Date Last Edited', hasSort: true, padding: 'checkbox' },
  { key: 'lastEditedBy', label: 'Last Edited By', hasSort: true, padding: 'checkbox' },
  { key: 'protocol', label: 'Protocol', hasSort: false, padding: 'checkbox' },
  { key: 'jurisdictions', label: 'Jurisdictions', hasSort: false, padding: 'checkbox' },
  { key: 'codingScheme', label: 'Coding Scheme', hasSort: false, padding: 'checkbox' },
  { key: 'code', label: '', hasSort: false, padding: 'checkbox' },
  { key: 'validate', label: '', hasSort: false, padding: 'checkbox' },
  { key: 'export', label: 'Export', hasSort: false, padding: 'checkbox' }
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
    <TableRow key="headers" style={{ width: '100%' }}>
      <TableCell
        key="bookmarked"
        id="bookmarked"
        scope="col"
        style={{ paddingLeft: 24, paddingRight: 0, width: '1%' }}>
        <IconButton
          id="sort-bookmarked"
          color="#757575"
          onClick={() => onSortBookmarked()}
          placement="top-start"
          tooltipText="Sort bookmarked">
          {sortBookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </TableCell>
      {visible.map(c => (
        <TableCell key={c.key} id={c.key} padding={c.padding || 'default'} scope="col">
          {c.hasSort ? (
            <Tooltip
              text={`Sort by ${c.label}`}
              id={`sort-by-${c.key}`}>
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
