import React from 'react'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'

/**
 * Table header for the document list
 */
export const DocListTableHead = () => {

  const r2Columns = [
    { key: 'file-name', label: 'File Name', padding: 'checkbox' , width:'100%'},
    { key: 'uploaded-by', label: 'Uploaded By', padding: 'checkbox' },
    { key: 'uploaded-data', label: 'Uploaded Date', padding: 'checkbox' }
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

}

export default DocListTableHead