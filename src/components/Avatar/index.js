import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiAvatar } from '@material-ui/core/Avatar'
import { withTheme } from '@material-ui/core/styles'

/**
 * @component
 * Shows an circular avatar with initials or img
 */
export const Avatar = ({ big, avatar, initials, style, theme, cardAvatar, userName, ...otherProps }) => {
  const styles = {
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    width: big ? '45px' : '30px',
    height: big ? '45px' : '30px',
    fontSize: '1rem',
    borderColor: theme.palette.secondary.main,
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
      alt={`${userName} avatar`}
      {...otherProps}
      src={avatar}
    />
    : <MuiAvatar style={cardAvatar ? cardAvatarStyles : styles} {...otherProps}>{initials ? initials : ''}</MuiAvatar>
}

Avatar.propTypes = {
  /**
   * If true, the avatar is 45x45 px. If false, the avatar is 30x30
   */
  big: PropTypes.bool,

  /**
   * Image src of the avatar
   */
  avatar: PropTypes.any,

  /**
   * Initials of user, if avatar img src is undefined
   */
  initials: PropTypes.string,

  /**
   * Can override any default style
   */
  style: PropTypes.object,

  /**
   * Theme of project provided by @material-ui/core
   */
  theme: PropTypes.object,

  /**
   * If true, avatar will have a white border around it with box shadow (similar to Card)
   */
  cardAvatar: PropTypes.bool,

  /**
   * The first and last name of the user for which the avatar was created (needed for aria-label attribute)
   */
  userName: PropTypes.string
}

Avatar.defaultProps = {
  big: false,
  cardAvatar: false,
  initials: '',
  style: {},
  theme: {},
  userName: ''
}

export default withTheme()(Avatar)