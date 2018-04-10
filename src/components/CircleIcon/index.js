import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import { withTheme } from 'material-ui/styles'

export const CircleIcon = ({ circleColor, iconColor, iconSize, circleSize, children, theme }) => {
  const color = theme.palette[circleColor]['500']
  const styles = {
    backgroundColor: color,
    borderRadius: '50%',
    height: circleSize,
    width: circleSize,
    display: 'flex',
    alignItems: 'center'
  }

  return (
    <div style={styles}>
      <Icon color={iconColor} size={iconSize} style={{ flex: '1', textAlign: 'center' }}>
        {children}
      </Icon>
    </div>
  )
}

CircleIcon.propTypes = {
  circleColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  circleSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.string,
  theme: PropTypes.object
}

CircleIcon.defaultProps = {
  circleColor: 'primary',
  iconColor: '#fff',
  iconSize: '24px',
  circleSize: '35px'
}

export default withTheme()(CircleIcon)