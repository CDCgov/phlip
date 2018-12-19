import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CheckboxLabel from 'components/CheckboxLabel'
import moment from 'moment'
import { connect } from 'react-redux'
import TextLink from 'components/TextLink'

/**
 * Represents one row in the document management table
 */
export const DocListTableRow = props => {
  const { doc, onSelectFile, isChecked, projectList, jurisdictionList } = props
  const date = moment.utc(doc.uploadedDate).local().format('M/D/YYYY, h:mm A')
  const listStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, maxWidth: 250 }

  return (
    <TableRow>
      <TableCell padding="checkbox" style={{ paddingLeft: 24, paddingRight: 0, width: '1%' }}>
        <CheckboxLabel input={{ value: isChecked, onChange: onSelectFile }} />
      </TableCell>
      <TableCell padding="checkbox">
        <TextLink to={{ pathname: `/docs/${doc._id}/view`, state: { document: { ...doc } } }}>
          {doc.name}
        </TextLink>
      </TableCell>
      <TableCell padding="checkbox">{doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</TableCell>
      <TableCell padding="checkbox">{date}</TableCell>
      <TableCell padding="checkbox" style={listStyle}>{projectList.join(', ')}</TableCell>
      <TableCell padding="checkbox" style={listStyle}>{jurisdictionList.join(', ')}</TableCell>
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
  onSelectFile: PropTypes.func,
  /**
   * project list
   */
  projectList: PropTypes.array,
  /**
   * jurisdiction list
   */
  jurisdictionList: PropTypes.array
}

// istanbul ignore next
const mapStateToProps = (state, ownProps) => {
  // istanbul ignore next
  const doc = state.scenes.docManage.main.documents.byId[ownProps.id]
  return {
    doc,
    projectList: doc.projects.map(proj => {
      return state.data.projects.byId[proj] === undefined ? '' : state.data.projects.byId[proj].name
    }),
    jurisdictionList: doc.jurisdictions.map(jur => {
      return state.data.jurisdictions.byId[jur] === undefined ? '' : state.data.jurisdictions.byId[jur].name
    }),
    isChecked: state.scenes.docManage.main.documents.checked.includes(ownProps.id)
  }
}

export default connect(mapStateToProps)(DocListTableRow)