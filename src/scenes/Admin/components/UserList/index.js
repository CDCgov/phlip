import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead, TableFooter, TablePagination, TableRow } from 'material-ui/Table'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import UserTableBody from './components/UserTableBody'
import UserTableHead from './components/UserTableHead'

export const UserList = props => {
  const { users, page, rowsPerPage, sortBy, direction, count } = props
  const { handleRequestSort, handlePageChange, handleRowsChange } = props
  return (
    <Container flex>
      <Column flex displayFlex style={{ overflowX: 'auto' }} component={<Card />}>
        <Table style={{ borderCollapse: 'separate' }}>
          <TableHead>
            <UserTableHead
              sortBy={sortBy}
              direction={direction}
              onRequestSort={handleRequestSort}
            />
          </TableHead>
          <TableBody>
            <UserTableBody users={users} />
          </TableBody>
        </Table>
        {/* <div style={{ display: 'flex', flex: 1, paddingBottom: '50px' }} />
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsChange} />
            </TableRow>
          </TableFooter>
        </Table> */}
      </Column>
    </Container>
  )
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  sortBy: PropTypes.string,
  direction: PropTypes.oneOf(['asc', 'desc']),
  count: PropTypes.number,
  handleRequestSort: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleRowsChange: PropTypes.func
}

export default UserList




