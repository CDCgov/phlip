import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import moment from 'moment'


const DocListTableRow = props => {
  const { name, _id, onCheckFile, isChecked, uploadedDate, uploadedBy } = props
  const date = moment.utc(uploadedDate).local().format('M/D/YYYY, h:mm A')

  return (
    <TableRow>
      <TableCell padding="checkbox" style={{ paddingLeft: 24, paddingRight: 0, width: '1%'}}>
        <CheckboxLabel onChange={() => onCheckFile(_id)} input={{ value: isChecked }} />
      </TableCell>
      <TableCell padding="checkbox">{name}</TableCell>
      <TableCell padding="checkbox">{uploadedBy.firstName} {uploadedBy.lastName}</TableCell>
      <TableCell padding="checkbox">{date}</TableCell>
    </TableRow>
  )
}

export default DocListTableRow