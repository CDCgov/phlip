import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import TextLink from 'components/TextLink'
import Typography from 'material-ui/Typography'

const styles = {
  padding: '5px',
  textAlign: 'center',
  fontWeight: 'lighter'
}


const UserTableBody = ({ users }) => {
  return (
    users.map(user => (
      <TableRow key={user.id}>
        <TableCell key={`${user.id}-name`} header="name">
          <span style={{ color: '#9a9c9c' }}>{user.firstName} {user.lastName}</span>
        </TableCell>
        <TableCell key={`${user.id}-email`} header="email">
          <span style={{ color: '#9a9c9c' }}>{user.email}</span>
        </TableCell>
        <TableCell key={`${user.id}-role`} header="role">
          <span style={{ color: '#9a9c9c', fontStyle: 'italic' }}>{user.role}</span>
        </TableCell>
        <TableCell key={`${user.id}-edit`} header="edit">
          <TextLink to={'/admin/edit/user/' + user.id}>Edit</TextLink>
        </TableCell>
      </TableRow>
    ))
  )
}


UserTableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default UserTableBody