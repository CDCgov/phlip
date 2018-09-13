import React from 'react'
import PropTypes from 'prop-types'

const Grid = props => {
  const { type, flex, container, align, justify, children, style, padding, raised, circular, ...otherProps } = props

  const elStyle = {
    display: container ? 'flex' : 'block',
    ...container ? {
      alignItems: align,
      justifyContent: justify
    } : {},
    padding,
    ...raised ? {
      boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
      borderRadius: circular ? '50%' : '.28571429rem',
      border: '1px solid rgba(34,36,38,.15)',
      backgroundColor: 'white'
    } : {},
    ...circular ? { borderRadius: '50%', padding: '2em' } : {},
    ...flex ? { flex: '1 1 auto' } : {},
    ...container ? { flexDirection: type } : {},
    ...style
  }

  return (
    <div style={elStyle} {...otherProps}>{children}</div>
  )
}

const alignJustifyTypes = [
  'normal',
  'flex-start',
  'flex-end',
  'center',
  'self-start',
  'self-end',
  'baseline',
  'stretch',
  'safe',
  'unsafe',
  'space-between'
]

Grid.defaultProps = {
  type: 'column',
  flex: false,
  container: false,
  align: 'stretch',
  justify: 'stretch',
  style: {},
  padding: 0,
  raised: false,
  circular: false
}

Grid.propTypes = {
  type: PropTypes.oneOf(['row', 'column']),
  flex: PropTypes.bool,
  container: PropTypes.bool,
  align: PropTypes.oneOf(alignJustifyTypes),
  justify: PropTypes.oneOf(alignJustifyTypes),
  style: PropTypes.object,
  raised: PropTypes.bool,
  circular: PropTypes.bool,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default Grid