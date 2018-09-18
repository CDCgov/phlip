import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'

const DocListTableHead = props => {
  const { onSelectAll, allSelected } = props

  const columns = [
    {
      key: 'select-all',
      label: <CheckboxLabel input={{ value: allSelected, onChange: onSelectAll }} />,
      style: { paddingLeft: 24, paddingRight: 0 },
      width: '1%'
    },
    { key: 'file-name', label: 'File Name', padding: 'checkbox' },
    { key: 'uploaded-by', label: 'Uploaded By', padding: 'checkbox' },
    { key: 'uploaded-data', label: 'Uploaded Date', padding: 'checkbox' }
  ]

  return (
    <TableRow key="docTableHeaders" style={{ width: '100%' }}>
      {columns.map((column, i) => {
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
  )
}

DocListTableHead.propTypes = {
  onSelectAll: PropTypes.func,
  allSelected: PropTypes.bool
}

DocListTableHead.defaultProps = {
  allSelected: false
}

export default DocListTableHead