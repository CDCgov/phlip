import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead, TableFooter, TablePagination, TableRow } from 'material-ui/Table'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import UserTableBody from './components/UserTableBody'
import UserTableHead from './components/UserTableHead'

export const UserList = props => {
  const { users, page, rowsPerPage, sortBy, direction } = props
  const { handleRequestSort } = props
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
      </Column>
    </Container>
  )
}

export default UserList




