import React, { Fragment } from 'react'
import Avatar from 'components/Avatar'
import { Row } from 'components/Layout/index'

export const AvatarList = ({ users, }) => {
  const styles = {
    marginRight: '-6px',
    border: 'solid 3px white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)',
    width: '38px',
    height: '38px'
  }

  return (
    <Fragment>
      {users.map((user, index) => (
        <Avatar style={styles} key={index} initials={user.initials ? user.initials : ''} />
      ))}
    </Fragment>
  )
}

export default AvatarList