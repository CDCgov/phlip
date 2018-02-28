import React from 'react'
import { default as MuiAvatar } from 'material-ui/Avatar'
import PropTypes from 'prop-types'

const Avatar = ({ big, avatarUrl, initials, style, cardAvatar, ...otherProps }) => {
  const styles = {
    color: 'white',
    backgroundColor: 'teal',
    width: big ? '45px' : '30px',
    height: big ? '45px' : '30px',
    fontSize: '1rem',
    ...style
  }

  const cardAvatarStyles = {
    marginRight: '-6px',
    border: 'solid 3px white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)',
    width: '38px',
    height: '38px',
    backgroundColor: 'teal',
    fontSize: '1rem',
    ...style
  }

  return avatarUrl ? <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps} src={avatarUrl}></MuiAvatar>
    : <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps}>{initials ? initials : ''}</MuiAvatar>
}

Avatar.propTypes = {
  big: PropTypes.bool,
  avatarUrl: PropTypes.any
}

Avatar.defaultProps = {
  big: false
}

export default Avatar