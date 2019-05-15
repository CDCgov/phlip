import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Tooltip, TableRow, TableCell, CheckboxLabel } from 'components'
import TableSortLabel from '@material-ui/core/TableSortLabel'

/**
 * Table header for the document list
 */
export const DocListTableHead = props => {
  const { onSelectAll, allSelected, onActionSelected, sortBy, direction, onRequestSort } = props
  
  const options = [
    { value: 'bulk', label: 'Actions', disabled: true },
    { value: 'deleteDoc', label: 'Delete' },
    { value: 'assignProject', label: 'Assign Project' },
    { value: 'assignJurisdiction', label: 'Assign Jurisdiction' },
    { value: 'approveDoc', label: 'Approve' }
  ]
  
  const r1Columns = [
    {
      key: 'action',
      label: <Dropdown
        options={options}
        input={{
          value: 'bulk',
          onChange: onActionSelected
        }}
        SelectDisplayProps={{ style: { paddingBottom: 3 } }}
        style={{ fontSize: 13, color: '#757575', fontWeight: 400 }}
        formControlStyle={{ minWidth: 140 }}
      />,
      style: { paddingLeft: 20, paddingRight: 0 }
    }
  ]
  
  const r2Columns = [
    {
      key: 'select-all',
      label: <CheckboxLabel input={{ value: allSelected, onChange: onSelectAll }} />,
      style: { paddingLeft: 24, paddingRight: 0, width: '1%' }
    },
    { key: 'name', label: 'Document Name', padding: 'checkbox', hasSort: true },
    { key: 'uploadedByName', label: 'Uploaded By', padding: 'checkbox', hasSort: true },
    { key: 'uploadedDate', label: 'Uploaded Date', padding: 'checkbox', hasSort: true },
    { key: 'doc-projects', label: 'Projects', padding: 'checkbox' },
    { key: 'doc-jurisdictions', label: 'Jurisdictions', padding: 'checkbox' },
    { key: 'approved', label: 'Approved', padding: 0 }
  ]
  
  return (
    <>
      <TableRow key="bulkAction" style={{ width: '100%' }}>
        {r1Columns.map((column, i) => {
          return (
            <TableCell
              scope="col"
              id={column.key}
              padding={column.padding}
              key={column.key}
              colSpan={2}
              style={{ borderBottom: 'none', width: column.width, ...column.style }}>
              {column.label}
            </TableCell>
          )
        })}
      </TableRow>
      <TableRow key="docTableHeaders" style={{ width: '100%' }}>
        {r2Columns.map((column, i) => {
          return (
            <TableCell
              key={column.key}
              id={column.key}
              padding={column.padding || 'default'}
              scope="col"
              style={column.style}>
              {column.hasSort ? (
                <Tooltip
                  text={`Sort by ${column.label}`}
                  id={`sort-by-${column.key}`}>
                  <TableSortLabel
                    active={sortBy === column.key}
                    style={{ color: 'inherit' }}
                    direction={direction}
                    onClick={() => onRequestSort(column.key)}>
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              ) : column.label}
            </TableCell>
          )
        })}
      </TableRow>
    </>
  )
}

DocListTableHead.propTypes = {
  /**
   * Handles when the user clicks the checkbox table header
   */
  onSelectAll: PropTypes.func,
  /**
   * Whether or not all files are currently selected
   */
  allSelected: PropTypes.bool,
  /**
   * Handles when the user select an action from the dropdown
   */
  onActionSelected: PropTypes.func,
  /**
   * Handles when the user click on apply button
   */
  onActionApply: PropTypes.func,
  /**
   * Specify the field to be sort
   */
  sortBy: PropTypes.string,
  /**
   * Specify sort direction
   */
  direction: PropTypes.string,
  /**
   * Specify sort direction
   */
  onRequestSort: PropTypes.func
}

DocListTableHead.defaultProps = {
  allSelected: false
}

export default DocListTableHead
