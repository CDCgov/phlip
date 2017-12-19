import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead, TableFooter, TableRow } from 'material-ui/Table'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import ProjectTableRow from './components/ProjectRow'
import ProjectTableHead from './components/ProjectTableHead'
import TablePagination from 'components/TablePagination'

export const ProjectList = props => {
  const { projectIds, user, page, rowsPerPage, projectCount, sortBy, direction, sortBookmarked } = props
  const { handlePageChange, handleRowsChange, handleRequestSort, handleSortBookmarked } = props
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
            {projectIds.map(id => (
              <ProjectTableRow key={id} id={id} />
            ))}
          </TableBody>
        </Table>
        <div style={{ display: 'flex', flex: 1, paddingBottom: '50px' }}/>
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
      </Column>
    </Container>
  )
}


export default ProjectList
