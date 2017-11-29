import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Card from 'components/Card'
import Table from 'components/ListTable'
import UserTableBody from './components/UserTableBody'

const UserList = ({ users }) => {
  const headers = [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'role', title: 'Role' },
    { id: 'edit', title: '' }
  ]

  return (
    <Grid container spacing={0} style={{ flex: '1', paddingTop: '25px' }}>
      <Grid item xs style={{ display: 'flex', flexDirection: 'column' }}>
        <Card>
          <Table headers={headers}>
            <UserTableBody users={users} />
          </Table>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList