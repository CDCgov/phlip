import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell } from 'material-ui/Table'
import IconButton from 'components/IconButton'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextLink from 'components/TextLink'

export const JurisdictionRow = ({ jurisdiction, id, projectId }) => {
  return (<TableRow key={`jurisdiction-${id}`}>
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
      <TextLink to={{ pathname: `/project/${projectId}/jurisdictions/${jurisdiction.id}/edit`, state: { jurisdictionDefined: { ...jurisdiction }}}}>
        <IconButton color="accent">mode_edit</IconButton>
      </TextLink>
    </TableCell>
  </TableRow>)
}

JurisdictionRow.propTypes = {
  jurisdiction: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

const mapStateToProps = (state, ownProps) => ({
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdictions.byId[ownProps.id]
})

export default connect(mapStateToProps)(JurisdictionRow)