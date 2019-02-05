import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
// import Table from 'components/Table'
// import TableBody from '@material-ui/core/TableBody'
// import DocListTableHead from './components/DocListTableHead'
// import TableHead from '@material-ui/core/TableHead'
// import DocListTableRow from './components/DocListTableRow'
import Typography from '@material-ui/core/Typography'

export const ConfirmDocList = props => {
  const {
    // documents,
    docCount
  } = props

  return (
    <FlexGrid container flex style={{ overflow: 'hidden' }}>
      <FlexGrid>
        <Typography align='center' >
            Number of Documents Selected: {docCount}
        </Typography>
      </FlexGrid>
      {/*<Table*/}
      {/*style={{*/}
      {/*borderCollapse: 'separate',*/}
      {/*tableLayout: 'auto',*/}
      {/*display: documents.length > 0 ? 'block' : 'table',*/}
      {/*overflow: 'auto'*/}
      {/*}}*/}
      {/*summary="List of documents">*/}
      {/*<TableHead style={{ width: '100%' }}>*/}
      {/*<DocListTableHead />*/}
      {/*</TableHead>*/}
      {/*<TableBody>*/}
      {/*{documents.map(docId => <DocListTableRow*/}
      {/*key={`doc-${docId}`}*/}
      {/*id={docId}*/}
      {/*/>)}*/}
      {/*</TableBody>*/}
      {/*</Table>*/}
    </FlexGrid>
  )
}

ConfirmDocList.propTypes = {
  /**
   * List of document ids
   */
  documents: PropTypes.array,

  /**
   * Current page in table
   */
  page: PropTypes.number,

  /**
   * Currently selected # of rows per page to show
   */
  rowsPerPage: PropTypes.string,

  /**
   * Handles when the user clicks the checkbox table header to select all files
   */
  onSelectAllFiles: PropTypes.func,

  /**
   * Handles when a user clicks the checkbox table cell in a row
   */
  onSelectOneFile: PropTypes.func,

  /**
   * Total number of documents
   */
  docCount: PropTypes.number,

  /**
   * Handles when the user requests to change pages in table
   */
  onChangePage: PropTypes.func,

  /**
   * Handles when the user requests to change number of rows per page
   */
  onChangeRows: PropTypes.func,

  /**
   * Whether or not all files are selected (by clicking the talbe header checkbox)
   */
  allSelected: PropTypes.bool,

  /**
     * Handles when the user confirm action
     */
  onBulkActionConfirm: PropTypes.func
}

export default ConfirmDocList