import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, FlexGrid, Table, TablePagination } from 'components'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import DocListTableHead from './components/DocListTableHead'
import DocListTableRow from './components/DocListTableRow'
import Switch from '@material-ui/core/Switch'

export const DocList = props => {
  const {
    onSelectAllFiles, onSelectOneFile, rowsPerPage, page, sortBy, sortDirection, userRole, showAll, toggleAllDocs,
    onChangePage, onChangeRows, documents, docCount, allSelected, onBulkAction, handleSortRequest
  } = props
  
  let options = [
    { value: 'bulk', label: 'Actions', disabled: true },
    { value: 'project', label: 'Assign Project' },
    { value: 'jurisdiction', label: 'Assign Jurisdiction' },
    { value: 'approve', label: 'Approve' },
    { value: 'removeproject', label: 'Remove Project' }
  ]
  
  options = userRole === 'Admin' ? [...options, { value: 'delete', label: 'Delete' }] : options
  
  return (
    <FlexGrid container flex style={{ overflow: 'hidden' }}>
      <FlexGrid container type="row" justify="space-between" align="center" padding="6px 24px" style={{ height: 56 }}>
        <Dropdown
          options={options}
          input={{
            value: 'bulk',
            onChange: (actionType) => onBulkAction(actionType)
          }}
          SelectDisplayProps={{ style: { paddingBottom: 3, minWidth: 140 } }}
          style={{ fontSize: 13, color: '#757575', fontWeight: 400 }}
        />
        <FlexGrid container type="row" align="center">
          <Switch checked={showAll} onChange={() => toggleAllDocs()} />
          <Typography variant="caption">Show All Documents</Typography>
        </FlexGrid>
      </FlexGrid>
      <Table
        style={{
          borderCollapse: 'separate',
          tableLayout: 'auto',
          display: documents.length > 0 ? 'block' : 'table',
          overflow: 'auto'
        }}
        summary="List of documents">
        <TableHead style={{ width: '100%' }}>
          <DocListTableHead
            onSelectAll={() => onSelectAllFiles()}
            allSelected={allSelected}
            onActionSelected={(actionType) => onBulkAction(actionType)}
            onRequestSort={handleSortRequest}
            sortBy={sortBy}
            userRole={userRole}
            direction={sortDirection}
          />
        </TableHead>
        <TableBody id="documentTable">
          {documents.map(docId => <DocListTableRow
            key={`doc-${docId}`}
            id={docId}
            onSelectFile={() => onSelectOneFile(docId)}
          />)}
        </TableBody>
      </Table>
      <FlexGrid flex />
      <Table>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={docCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, page) => {
                if (event !== null) onChangePage(page)
              }}
              onChangeRowsPerPage={event => onChangeRows(event.target.value)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </FlexGrid>
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
  allSelected: PropTypes.bool,
  /**
   * Handles when the user requests to change pages in table
   */
  onBulkAction: PropTypes.func,
  /**
   * Handles when the user requests sorting
   */
  handleSortRequest: PropTypes.func,
  /**
   * Current value that the table is being sorted by
   */
  sortBy: PropTypes.string,
  /**
   * Current direction the table is being sorted
   */
  sortDirection: PropTypes.string,
  /**
   * Current user role
   */
  userRole: PropTypes.oneOf(['Admin', 'Coordinator', 'Coder']),
  /**
   * Whether or not to show all docs as opposed to just the ones uploaded by the user
   */
  showAll: PropTypes.bool,
  /**
   * Function called when the user toggles the switch
   */
  toggleAllDocs: PropTypes.func
}

export default DocList
