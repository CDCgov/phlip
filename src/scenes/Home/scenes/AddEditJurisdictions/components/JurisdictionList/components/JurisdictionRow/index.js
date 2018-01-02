import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell } from 'material-ui/Table'
import IconButton from 'components/IconButton'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export const JurisdictionRow = ({ jurisdiction, id, onOpenForm }) => (
  <TableRow key={`jurisdiction-${id}`}>
    <TableCell key={`${id}-segment-name`}>
      {jurisdiction.name}
      </TableCell>
    <TableCell key={`${id}-segment-start`}>
      {new Date(jurisdiction.startDate).toLocaleDateString()}
      </TableCell>
    <TableCell key={`${id}-segment-end`}>
      {new Date(jurisdiction.endDate).toLocaleDateString()}
      </TableCell>
    <TableCell>
      <IconButton color="accent" onClick={() => onOpenForm(true, jurisdiction)}>mode_edit</IconButton>
    </TableCell>
  </TableRow>
)

JurisdictionRow.propTypes = {
  jurisdiction: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onOpenForm: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdictions.byId[ownProps.id]
})

export default connect(mapStateToProps)(JurisdictionRow)