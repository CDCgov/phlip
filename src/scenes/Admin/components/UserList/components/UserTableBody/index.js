import React from 'react'
import PropTypes from 'prop-types'
import { TableCell } from 'material-ui/Table'
import TableRow from 'components/TableRow'
import TextLink from 'components/TextLink'
import Typography from 'material-ui/Typography'

const styles = {
  padding: '5px',
  textAlign: 'center',
  fontWeight: 'lighter'
}

const Cell = ({ id, children, header }) => {
  return <TableCell key={`${id}-${header}`} style={styles} padding="none">{children}</TableCell>
}


const UserTableBody = ({ users }) => {
  return (
    users.map(user => (
      <TableRow key={user.id}>
        <Cell id={user.id} header="name">
          <span style={{ color: '#9a9c9c' }}>{user.firstName} {user.lastName}</span>
        </Cell>
        <Cell id={user.id} header="email">
          <span style={{ color: '#9a9c9c' }}>{user.email}</span>
        </Cell>
        <Cell id={user.id} header="role">
          <span style={{ color: '#9a9c9c', fontStyle: 'italic' }}>{user.role}</span>
        </Cell>
        <Cell id={user.id} header="edit">
          <TextLink to={'/admin/edit/user/' + user.id}>Edit</TextLink>
        </Cell>
      </TableRow>
    ))
  )
}

UserTableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default UserTableBody