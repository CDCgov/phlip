import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell } from 'material-ui/Table'
import IconButton from 'components/IconButton'

export const JurisdictionRow = ({ jurisdiction, index, onOpenForm }) => (
  <TableRow key={`jurisdiction-${index}`}>
    <TableCell key={`${index}-segment-name`}>
      {jurisdiction.name}
      </TableCell>
    <TableCell key={`${index}-segment-start`}>
      {new Date(jurisdiction.startDate).toLocaleDateString()}
      </TableCell>
    <TableCell key={`${index}-segment-end`}>
      {new Date(jurisdiction.endDate).toLocaleDateString()}
      </TableCell>
    <TableCell>
      <IconButton color="accent" onClick={() => onOpenForm(true, jurisdiction)}>mode_edit</IconButton>
    </TableCell>
    <TableCell>
      <IconButton color="error">delete</IconButton>
    </TableCell>
  </TableRow>
)

JurisdictionRow.propTypes = {

}

export default JurisdictionRow