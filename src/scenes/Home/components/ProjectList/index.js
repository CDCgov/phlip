import React from 'react'
import PropTypes from 'prop-types'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Table from 'components/Table'
import TablePagination from 'components/TablePagination'
import FlexGrid from 'components/FlexGrid'
import ProjectPanel from './components/ProjectPanel'

export const ProjectList = props => {
  const { projectIds, user, page, rowsPerPage, projectCount } = props
  const { handlePageChange, handleRowsChange, handleExport, getProjectUsers } = props

  return (
      <>
        <div style={{overflow:'auto'}}>
          {projectIds.map(id => (<ProjectPanel key={id} id={id} onExport={handleExport} role={user.role} getProjectUsers = {getProjectUsers} />))}
        </div>
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
</>
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
  getProjectUsers: PropTypes.func,
  resetOpenProject: PropTypes.func
//  users: PropTypes.array
}

export default ProjectList
