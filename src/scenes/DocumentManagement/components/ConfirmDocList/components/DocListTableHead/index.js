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
        { value: 'deleteDoc', label: 'Delete' }, { value: 'assignProject', label: 'Assign projects' },
        { value: 'assignJurisdiction', label: 'Assign Jurisdictions' }
    ]
  const r2Columns = [

    { key: 'file-name', label: 'File Name', padding: 'checkbox' },
    { key: 'uploaded-by', label: 'Uploaded By', padding: 'checkbox' },
    { key: 'uploaded-data', label: 'Uploaded Date', padding: 'checkbox' },
    // { key: 'doc-projects', label: 'Projects', padding: 'checkbox' },
    // { key: 'doc-jurisdictions', label: 'Jurisdictions', padding: 'checkbox' }
  ]

  return (
    <React.Fragment>
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
   onActionApply: PropTypes.func
}

DocListTableHead.defaultProps = {
  allSelected: false
}

export default DocListTableHead