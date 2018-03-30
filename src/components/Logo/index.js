import React from 'react'
import PropTypes from 'prop-types'

const Logo = props => {
  const { height, width } = props
  return (
   <img src="/phlip-logo.png" style={{ height, width }} alt="Public Health Law Investigation Platform"/>
  )
}

Logo.defaultProps = {
  width: 'auto'
}

Logo.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Logo