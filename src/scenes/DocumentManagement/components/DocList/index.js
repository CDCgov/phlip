import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Table from 'components/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import SearchBar from 'components/SearchBar'
import DocListTableHead from './components/DocListTableHead'
import DocListTableRow from './components/DocListTableRow'
import TablePagination from 'components/TablePagination'

export const DocList = props => {
  const {
    onSearchDocs, onSelectAllFiles, onSelectOneFile, rowsPerPage, page,
    onChangePage, onChangeRows, documents, docCount, allSelected
  } = props

  return (
    <Grid container flex raised>
      <Grid type="row" container align="center" justify="space-between" padding="25px 20px 20px 20px">
        <Grid></Grid>
        <Grid>
          {/*<SearchBar placeholder="Search" />*/}
        </Grid>
      </Grid>
      <Grid container flex style={{ overflow: 'hidden' }}>
        <Table
          style={{ borderCollapse: 'separate', tableLayout: 'auto', display: 'block', overflow: 'auto' }}
          summary="List of documents">
          <TableHead style={{ width: '100%' }}>
            <DocListTableHead onSelectAll={() => onSelectAllFiles()} allSelected={allSelected} />
          </TableHead>
          <TableBody>
            {documents.map(docId => <DocListTableRow
              key={`doc-${docId}`}
              id={docId}
              onSelectFile={() => onSelectOneFile(docId)}
            />)}
          </TableBody>
        </Table>
        <Grid flex />
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={docCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, page) => onChangePage(page)}
                onChangeRowsPerPage={(event) => onChangeRows(event.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Grid>
    </Grid>
  )
}

DocList.propTypes = {
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
  allSelected: PropTypes.bool
}

export default DocList