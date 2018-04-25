import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiAvatar } from 'material-ui/Avatar'
import { withTheme } from 'material-ui/styles'

export const Avatar = ({ big, avatar, initials, style, theme, cardAvatar, ...otherProps }) => {
  const styles = {
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
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
    backgroundColor: theme.palette.secondary.main,
    fontSize: '1rem',
    ...style
  }

  return avatar
    ? <MuiAvatar
      style={cardAvatar ? cardAvatarStyles : styles}
      alt="user-avatar"
      {...otherProps}
      src={avatar} />
    : <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps}>{initials ? initials : ''}</MuiAvatar>
}

Avatar.propTypes = {
  big: PropTypes.bool,
  avatar: PropTypes.any,
  initials: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.object,
  cardAvatar: PropTypes.bool
}

Avatar.defaultProps = {
  big: false
}

export default withTheme()(Avatar)