import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import moment from 'moment'
import { connect } from 'react-redux'

const DocListTableRow = props => {
  const { id, doc, onSelectFile, isChecked } = props
  const date = moment.utc(doc.uploadedDate).local().format('M/D/YYYY, h:mm A')

  return (
    <TableRow>
      <TableCell padding="checkbox" style={{ paddingLeft: 24, paddingRight: 0, width: '1%'}}>
        <CheckboxLabel input={{ value: isChecked, onChange: onSelectFile }} />
      </TableCell>
      <TableCell padding="checkbox">{doc.name}</TableCell>
      <TableCell padding="checkbox">{doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</TableCell>
      <TableCell padding="checkbox">{date}</TableCell>
    </TableRow>
  )
}

DocListTableRow.propTypes = {
  doc: PropTypes.object,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  onSelectFile: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
  doc: state.scenes.docManage.main.documents.byId[ownProps.id],
  isChecked: state.scenes.docManage.main.documents.checked.includes(ownProps.id)
})

export default connect(mapStateToProps)(DocListTableRow)