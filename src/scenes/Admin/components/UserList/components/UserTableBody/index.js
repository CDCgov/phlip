import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import TextLink from 'components/TextLink'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import LazyLoad from 'react-lazyload'

const UserTableBody = ({ users }) => {
  return (
    users.map(user => (
      <TableRow key={user.id}>
        <TableCell key={`${user.id}-avatar`} style={{ width: 1 }}>
          {/* <LazyLoad height={0}> */}
          <Avatar cardAvatar avatarUrl={user.avatarUrl} initials={getInitials(user.firstName, user.lastName)} style={{ cursor: 'pointer' }} />
          {/* </LazyLoad> */}
        </TableCell>
        <TableCell key={`${user.id}-name`} header="name" padding="default"><span>{user.firstName} {user.lastName}</span></TableCell>
        <TableCell key={`${user.id}-email`} header="email" padding="default">{user.email}</TableCell>
        <TableCell key={`${user.id}-role`} header="role" padding="default">
          <span style={{ fontStyle: 'italic' }} padding="default">{user.role}</span>
        </TableCell>
        <TableCell key={`${user.id}-edit`} padding="default" header="edit">
          <TextLink aria-label="Edit user" to={'/admin/edit/user/' + user.id}>Edit</TextLink>
        </TableCell>
      </TableRow>
    ))
  )
}


UserTableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default UserTableBody