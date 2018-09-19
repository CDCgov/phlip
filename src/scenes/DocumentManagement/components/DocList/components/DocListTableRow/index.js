import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import moment from 'moment'
import { connect } from 'react-redux'

/**
 * Represents one row in the document management table
 */
const DocListTableRow = props => {
  const { doc, onSelectFile, isChecked } = props
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
  /**
   * Specific document from redux - documents[id]
   */
  doc: PropTypes.object,

  /**
   * ID of document used to retrieve specific document from redux
   */
  id: PropTypes.string,

  /**
   * Is the document currently selected (the checkbox cell selected)
   */
  isChecked: PropTypes.bool,

  /**
   * Handles when a user clicks the checkbox cell for this document
   */
  onSelectFile: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
  doc: state.scenes.docManage.main.documents.byId[ownProps.id],
  isChecked: state.scenes.docManage.main.documents.checked.includes(ownProps.id)
})

export default connect(mapStateToProps)(DocListTableRow)