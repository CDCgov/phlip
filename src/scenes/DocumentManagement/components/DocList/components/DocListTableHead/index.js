import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import {Dropdown
  // Button
} from 'components'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from 'components/Tooltip'

/**
 * Table header for the document list
 */
export const DocListTableHead = props => {
  const { onSelectAll, allSelected, onActionSelected, sortBy, direction,onRequestSort
    // onActionApply
  } = props
  const options = [
    {value:'bulk', label:'Bulk Operation', disabled:true},
    { value: 'deleteDoc', label: 'Delete' }, { value: 'assignProject', label: 'Assign projects' },
    { value: 'assignJurisdiction', label: 'Assign Jurisdictions' }
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
        style={{ fontSize: 13, color:'#757575' }}
        formControlStyle={{ minWidth: 140 }}
        // disabled= {!allowDropdown}
      />,
      style: { paddingLeft: 20, paddingRight: 0 }
    }
  ]
  const r2Columns = [
    {
      key: 'select-all',
      label: <CheckboxLabel input={{ value: allSelected, onChange: onSelectAll }} />,
      style: { paddingLeft: 24, paddingRight: 0 }
    },
    { key: 'name', label:'Document Name',padding: 'checkbox',hasSort: true},
    { key: 'uploadedByName', label: 'Uploaded By', padding: 'checkbox',hasSort:true },
    { key: 'uploadedDate', label: 'Uploaded Date', padding: 'checkbox',hasSort:true },
    { key: 'doc-projects', label: 'Projects', padding: 'checkbox' },
    { key: 'doc-jurisdictions', label: 'Jurisdictions', padding: 'checkbox' }
  ]

  return (
    <React.Fragment>
      <TableRow key="bulkAction" style={{ width: '100%' }}>
        {r1Columns.map((column, i) => {
          return (
            <TableCell
              scope="col"
              id={column.key}
              padding={column.padding}
              key={column.key}
              colSpan={2}
              style={{ borderBottom:'none', width: column.width, ...column.style }}>
              {column.label}
            </TableCell>
          )
        })}
      </TableRow>
      <TableRow key="docTableHeaders" style={{ width: '100%' }}>
        {r2Columns.map((column, i) => {
          return (
            <TableCell key={column.key} id={column.key} padding={column.padding || 'default'} scope="col">
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
            // <TableCell
            //   scope="col"
            //   id={column.key}
            //   padding={column.padding}
            //   key={column.key}
            //   style={{ width: column.width, ...column.style }}>
            //   {column.label}
            //
            // </TableCell>
          )
        })}
      </TableRow>
    </React.Fragment>
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