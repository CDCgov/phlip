import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import {Dropdown, Button} from 'components'

/**
 * Table header for the document list
 */
export const DocListTableHead = props => {
  const { onSelectAll, allSelected, onActionSelected, onActionApply } = props
  const options = [
        {value:'bulk', label:'Bulk Operation'},
        { value: 'deleteDoc', label: 'Delete' }, { value: 'assignProject', label: 'Assign projects' },
        { value: 'assignJurisdiction', label: 'Assign Jurisdictions' },
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
              style={{ fontSize: 13 }}
              formControlStyle={{ minWidth: 140 }}
              // disabled= {!allowDropdown}
            />,
            style: { paddingLeft: 20, paddingRight: 0 }
        },
        {
            key: 'apply',
            label:
  <Button
    value='Apply'
    raised={true}
    size="small"
    color="accent"
    onClick = {onActionApply}
  />,
            style: { paddingLeft: 20, paddingRight: 0 }
        },
    ]
  const r2Columns = [
    {
      key: 'select-all',
      label: <CheckboxLabel input={{ value: allSelected, onChange: onSelectAll }} />,
      style: { paddingLeft: 24, paddingRight: 0 }
    },
    { key: 'file-name', label: 'File Name', padding: 'checkbox' },
    { key: 'uploaded-by', label: 'Uploaded By', padding: 'checkbox' },
    { key: 'uploaded-data', label: 'Uploaded Date', padding: 'checkbox' },
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
                style={{ borderBottom:'none', width: column.width, ...column.style }}>
                {column.label}
              </TableCell>
            )
        })}
      </TableRow>
      <TableRow key="docTableHeaders" style={{ width: '100%' }}>
        {r2Columns.map((column, i) => {
            return (
              <TableCell
                scope="col"
                id={column.key}
                padding={column.padding}
                key={column.key}
                style={{ width: column.width, ...column.style }}>
                {column.label}
              </TableCell>
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

   allowDropdown : PropTypes.bool
}

DocListTableHead.defaultProps = {
  allSelected: false
}

export default DocListTableHead