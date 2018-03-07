import React from 'react'
import PropTypes from 'prop-types'
import Table from 'components/Table'
import { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table'
import JurisdictionRow from './components/JurisdictionRow'

export const JurisdictionList = ({ jurisdictions, projectId }) => (
  <Table>
    <TableHead>
      <TableRow key="jurisdiction-header">
        <TableCell key="segment-name">Segments</TableCell>
        <TableCell key="segment-start">Segment Start Date</TableCell>
        <TableCell key="segment-end">Segment End Date</TableCell>
        <TableCell key="segment-edit">Edit</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {jurisdictions.map(id => (
        <JurisdictionRow projectId={projectId} id={id} key={`jurisdictions-${id}`} />
      ))}
      </TableBody>
  </Table>
)

JurisdictionList.propTypes = {
  jurisdictions: PropTypes.array,
  onOpenForm: PropTypes.func
}

export default JurisdictionList