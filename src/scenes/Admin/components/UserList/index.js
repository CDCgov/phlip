import React from 'react'
import PropTypes from 'prop-types'
import { TableBody, TableHead } from 'material-ui/Table'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import UserTableBody from './components/UserTableBody'
import UserTableHead from './components/UserTableHead'

export const UserList = props => {
  const { users, sortBy, direction, handleRequestSort } = props
  return (
    <Container column flex>
      <Column flex displayFlex style={{ overflow: 'auto' }} component={<Card />}>
        <Table
          style={{ borderCollapse: 'separate', display: 'block', tableLayout: 'auto', overflow: 'unset' }}
          summary="List of users">
          <TableHead>
            <UserTableHead sortBy={sortBy} direction={direction} onRequestSort={handleRequestSort} />
          </TableHead>
          <TableBody>
            <UserTableBody users={users} />
          </TableBody>
        </Table>
      </Column>
    </Container>
  )
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  sortBy: PropTypes.string,
  direction: PropTypes.oneOf(['asc', 'desc']),
  handleRequestSort: PropTypes.func
}

export default UserList




