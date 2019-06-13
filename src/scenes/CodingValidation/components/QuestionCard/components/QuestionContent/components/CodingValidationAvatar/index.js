import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, FlexGrid, Icon, Tooltip } from 'components'
import theme from 'services/theme'

const sizeObj = {
  'small': {
    height: 20,
    width: 20,
    fontSize: '0.5rem'
  },
  'medium': {
    height: 25,
    width: 25,
    fontSize: '0.6rem'
  },
  'large': {
    height: 30,
    width: 30,
    fontSize: '0.8rem'
  }
}

export const CodingValidationAvatar = ({ user, size, isValidator, enabled, onClick, style }) => {
  const selectedStyle = {
    border: `2px solid ${theme.palette.error.main}`,
    boxSizing: 'border-box'
  }
  
  return (
    <Tooltip text={user.username}>
      <FlexGrid container align="flex-end" style={{ position: 'relative' }}>
        <Avatar
          avatar={user.avatar}
          initials={user.initials}
          userName={user.username}
          style={{
            margin: 0,
            outline: 0,
            backgroundColor: '#e9e9e9',
            color: 'black',
            cursor: onClick ? 'pointer' : 'default',
            ...sizeObj[size],
            ...enabled ? selectedStyle : {},
            ...style
          }}
          onClick={onClick}
        />
        {isValidator && <Avatar
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            backgroundColor: '#80d134',
            border: '2px solid white',
            top: 16,
            left: 16
          }}
          cardAvatar={true}
          initials={<Icon size="12px" color="white" style={{ fontWeight: 800 }}>check</Icon>}
        />}
      </FlexGrid>
    </Tooltip>
  )
}

CodingValidationAvatar.propTypes = {
  user: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isValidator: PropTypes.bool,
  onClick: PropTypes.func,
  enabled: PropTypes.bool,
  style: PropTypes.object
}

CodingValidationAvatar.defaultProps = {
  enabled: false,
  isValidator: false,
  onClick: undefined,
  size: 'large',
  user: {},
  style: {}
}

export default CodingValidationAvatar
