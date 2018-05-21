import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import { withTheme } from 'material-ui/styles'

/**
 * Renders an icon onto a circle div
 */
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
  /**
   * Color of the outer circle
   */
  circleColor: PropTypes.string,

  /**
   * Color of the icon
   */
  iconColor: PropTypes.string,

  /**
   * Size of the icon
   */
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Size of the outer circular div
   */
  circleSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * String name of the icon from https://material.io/tools/icons/?style=baseline to display.
   */
  children: PropTypes.string,

  /**
   * Material-ui theme object
   */
  theme: PropTypes.object
}

CircleIcon.defaultProps = {
  circleColor: 'primary',
  iconColor: '#fff',
  iconSize: '24px',
  circleSize: '35px'
}

export default withTheme()(CircleIcon)