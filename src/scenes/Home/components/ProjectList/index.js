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

export const ProjectList = props => {
  const { projectIds, user, page, rowsPerPage, projectCount, sortBy, direction, sortBookmarked, searchValue } = props
  const { handlePageChange, handleRowsChange, handleRequestSort, handleSortBookmarked, handleSearchValueChange, handleExport } = props
  return (
    <FlexGrid container raised flex>
      <FlexGrid type="row" container padding={15} align="center" justify="flex-end">
        <SearchBar
          searchValue={searchValue}
          handleSearchValueChange={handleSearchValueChange}
          placeholder="Search"
        />
      </FlexGrid>
      <FlexGrid container flex style={{ overflow: 'hidden' }}>
        <Table
          style={{ borderCollapse: 'separate', display: 'block', tableLayout: 'auto', overflow: 'auto' }}
          summary="List of projects">
          <TableHead style={{ width: '100%' }}>
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
            {projectIds.map(id => (<ProjectRow key={id} id={id} onExport={handleExport} />))}
          </TableBody>
        </Table>
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

export default ProjectList
