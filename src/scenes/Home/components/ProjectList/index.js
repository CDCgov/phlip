import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead, TableFooter, TableRow } from 'material-ui/Table'
import Container, { Column, Row } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import ProjectRow from './components/ProjectRow'
import ProjectTableHead from './components/ProjectTableHead'
import TablePagination from 'components/TablePagination'
import SearchBar from 'components/SearchBar'

export const ProjectList = props => {
  const { projectIds, user, page, rowsPerPage, projectCount, sortBy, direction, sortBookmarked, searchValue } = props
  const { handlePageChange, handleRowsChange, handleRequestSort, handleSortBookmarked, handleSearchValueChange, handleExport } = props
  return (
    <Container column flex>
      <Column flex displayFlex style={{ overflow: 'auto' }} component={<Card />}>
        <Row style={{ padding: 20, alignSelf: 'flex-end' }}>
          <SearchBar
            searchValue={searchValue}
            handleSearchValueChange={handleSearchValueChange}
            placeholder="Search"
          />
        </Row>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Table style={{ borderCollapse: 'separate', display: 'block', tableLayout: 'auto', overflow: 'unset' }}>
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
              {projectIds.map(id => (
                <ProjectRow key={id} id={id} onExport={handleExport} />
              ))}
            </TableBody>
          </Table>
        <div style={{ display: 'flex', flex: 1, paddingBottom: '50px' }} />
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
        </div>
      </Column>
    </Container>
  )
}

export default ProjectList
