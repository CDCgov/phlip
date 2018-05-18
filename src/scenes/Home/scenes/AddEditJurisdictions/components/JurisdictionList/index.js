import React from 'react'
import PropTypes from 'prop-types'
import Table from 'components/Table'
import { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table'
import JurisdictionRow from './components/JurisdictionRow'

export const JurisdictionList = ({ jurisdictions, projectId, project, onDelete }) => (
  <Table summary={`jurisdictions in ${project.name}`}>
    <TableHead>
      <TableRow key="jurisdiction-header">
        <TableCell key="segment-name" id="segment-name" scope="col">Jurisdiction</TableCell>
        <TableCell key="segment-start" id="segment-start-date" scope="col">Segment Start Date</TableCell>
        <TableCell key="segment-end" id="segment-end-date" scope="col">Segment End Date</TableCell>
        <TableCell key="segment-edit" id="edit-segment" scope="col">Edit</TableCell>
        <TableCell key="segment-delete" id="delete-segment" scope="col">Delete</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {jurisdictions.map(id => (
        <JurisdictionRow projectId={projectId} id={id} onDelete={onDelete} key={`jurisdictions-${id}`} />
      ))}
      </TableBody>
  </Table>
)

JurisdictionList.propTypes = {
  jurisdictions: PropTypes.array,
  onOpenForm: PropTypes.func
}

export default JurisdictionList