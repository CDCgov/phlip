import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead, TableFooter, TablePagination, TableRow } from 'material-ui/Table'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import ProjectTableBody from './components/ProjectTableBody'
import ProjectTableHead from './components/ProjectTableHead'

export const ProjectList = props => {
  const { projects, user, page, rowsPerPage, count, sortBy, direction, sortBookmarked, bookmarkList } = props
  const { handleToggleBookmark, handlePageChange, handleRowsChange, handleRequestSort, handleExport, handleSortBookmarked } = props
  return (
    <Container flex>
      <Column flex displayFlex style={{ overflowX: 'auto' }} component={<Card/>}>
        <Table style={{ borderCollapse: 'separate' }}>
          <TableHead>
            <ProjectTableHead
              role={user.role}
              sortBy={sortBy}
              direction={direction}
              sortBookmarked={sortBookmarked}
              onRequestSort={handleRequestSort}
              onSortBookmarked={handleSortBookmarked}
            />
          </TableHead>
          <TableBody>
            <ProjectTableBody
              user={user}
              projects={projects}
              bookmarkList={bookmarkList}
              onToggleBookmark={handleToggleBookmark}
              onExport={handleExport}
            />
          </TableBody>
        </Table>
        <div style={{ display: 'flex', flex: 1, paddingBottom: '50px' }}/>
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, page) => handlePageChange(page)}
                onChangeRowsPerPage={(event) => handleRowsChange(event.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Column>
    </Container>
  )
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,
  sortBy: PropTypes.string,
  direction: PropTypes.oneOf(['asc', 'desc']),
  sortBookmarked: PropTypes.bool,
  bookmarkList: PropTypes.array,
  handleToggleBookmark: PropTypes.func,
  handleChangePage: PropTypes.func,
  handleRowsChange: PropTypes.func,
  handleRequestSort: PropTypes.func,
  handleExport: PropTypes.func,
  handleSortBookmarked: PropTypes.func
}

export default ProjectList
