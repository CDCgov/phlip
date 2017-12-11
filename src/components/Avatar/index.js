import React from 'react'
import { default as MuiAvatar } from 'material-ui/Avatar'
import PropTypes from 'prop-types'

const Avatar = ({ big, initials, ...otherProps }) => {
  const styles = {
    color: 'white',
    backgroundColor: 'teal',
    width: big ? '45px' : '30px',
    height: big ? '45px' : '30px'
  }
  
  return <MuiAvatar style={styles} {...otherProps}>{initials ? initials : ''}</MuiAvatar>
}

Avatar.propTypes = {
  big: PropTypes.bool,
  initials: PropTypes.string
}

Avatar.defaultProps = {
  big: false
}

export default Avatar