import React from 'react'
import { default as MuiAvatar } from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import { withTheme } from 'material-ui/styles'

const Avatar = ({ big, avatar, initials, style, theme, cardAvatar, ...otherProps }) => {
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

  return avatar ? <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps} src={avatar}></MuiAvatar>
    : <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps}>{initials ? initials : ''}</MuiAvatar>
}

Avatar.propTypes = {
  big: PropTypes.bool,
  avatar: PropTypes.any
}

Avatar.defaultProps = {
  big: false
}

export default withTheme()(Avatar)