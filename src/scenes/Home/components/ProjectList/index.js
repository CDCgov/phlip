import React from 'react'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Table from 'components/Table'
import ProjectRow from './components/ProjectRow'
import ProjectTableHead from './components/ProjectTableHead'
import TablePagination from 'components/TablePagination'
import SearchBar from 'components/SearchBar'
import FlexGrid from 'components/FlexGrid'
import ProjectPanel from './components/ProjectPanel'

export const ProjectList = props => {
  const { projectIds, user, page, rowsPerPage, projectCount, sortBy, direction, sortBookmarked, searchValue } = props
  const { handlePageChange, handleRowsChange, handleRequestSort, handleSortBookmarked, handleSearchValueChange, handleExport, getProjectUsers } = props

  return (
    <FlexGrid container raised flex>
      {/*<FlexGrid*/}
      {/*type="row"*/}
      {/*container*/}
      {/*padding={15}*/}
      {/*align="center"*/}
      {/*justify="flex-end"*/}
      {/*/>*/}
      <FlexGrid container flex style={{ overflow: 'hidden' }}>
        {/*<Table*/}
        {/*style={{*/}
        {/*borderCollapse: 'separate',*/}
        {/*display: 'block',*/}
        {/*tableLayout: 'auto',*/}
        {/*overflow: 'auto'*/}
        {/*}}*/}
        {/*summary="List of projects">*/}
        {/*<TableHead style={{ width: '100%' }}>*/}
        {/*<ProjectTableHead*/}
        {/*role={user.role}*/}
        {/*sortBy={sortBy}*/}
        {/*direction={direction}*/}
        {/*sortBookmarked={sortBookmarked}*/}
        {/*onRequestSort={handleRequestSort}*/}
        {/*onSortBookmarked={handleSortBookmarked}*/}
        {/*/>*/}
        {/*</TableHead>*/}
        {/*<div style={{overflow:'auto', backgroundColor:'#f5f5f5', border:'none'}}>*/}
        <FlexGrid type='row' style={{overflow:'auto', backgroundColor:'#f5f5f5', border:'none'}}>
          {projectIds.map(id => (<ProjectPanel key={id} id={id} onExport={handleExport} role={user.role} getProjectUsers = {getProjectUsers} />))}
        </FlexGrid>
        {/*</div>*/}
        {/*</Table>*/}
        <FlexGrid flex />
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={projectCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, page) => handlePageChange(page)}
                onChangeRowsPerPage={(event) => handleRowsChange(event.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </FlexGrid>
    </FlexGrid>
  )
}

ProjectList.propTypes = {
  projectIds: PropTypes.array,
  user: PropTypes.object,
  page: PropTypes.number,
  rowsPerPage: PropTypes.string,
  projectCount: PropTypes.number,
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  sortBookmarked: PropTypes.bool,
  searchValue: PropTypes.string,
  handlePageChange: PropTypes.func,
  handleRowsChange: PropTypes.func,
  handleRequestSort: PropTypes.func,
  handleSortBookmarked: PropTypes.func,
  handleSearchValueChange: PropTypes.func,
  handleExport: PropTypes.func,
  getProjectUsers: PropTypes.func
//  users: PropTypes.array
}

export default ProjectList
