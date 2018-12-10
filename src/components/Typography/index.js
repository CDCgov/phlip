import React from 'react'
import { default as MuiTypography } from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const fontSizeLookup = {
  'display1': 96,
  'display2': 60,
  'display3': 48,
  'display4': 34,
  'headline': 24,
  'title': 20,
  'title2': 18,
  'subheading': 14,
  'body1': 14,
  'body2': 16,
  'caption': 12,
  'button': 14
}

export const Typography = props => {
  const { variant, style, ...otherProps } = props

  const fontVariant = variant === 'title2' ? 'title' : variant
  const fontSize = fontSizeLookup[variant]

  const typeStyle = {
    fontSize: `${(fontSize * .0625)}rem`,
    ...style,
  }

  return <MuiTypography variant={fontVariant} style={typeStyle} {...otherProps} />
}

Typography.defaultProps = {
  variant: 'body1'
}

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'display1', 'display2', 'display3', 'display4', 'title2',
    'headline', 'title', 'subheading', 'body1', 'body2', 'caption', 'button'
  ])
}

export default Typography