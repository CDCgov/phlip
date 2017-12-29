import React from 'react'
import PropTypes from 'prop-types'
import Table from 'components/Table'
import { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table'
import JurisdictionRow from './components/JurisdictionRow'

export const JurisdictionList = ({ jurisdictions, onOpenForm }) => (
  <Table>
    <TableHead>
      <TableRow key="jurisdiction-header">
        <TableCell key="segment-name">Segments</TableCell>
        <TableCell key="segment-start">Segment Start Date</TableCell>
        <TableCell key="segment-end">Segment End Date</TableCell>
        <TableCell key="segment-edit">Edit</TableCell>
        <TableCell key="segment-delete">Delete</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {jurisdictions.map(id => (
        <JurisdictionRow id={id} key={`jurisdictions-${id}`} onOpenForm={onOpenForm} />
      ))}
      </TableBody>
  </Table>
)

JurisdictionList.propTypes = {

}

export default JurisdictionList