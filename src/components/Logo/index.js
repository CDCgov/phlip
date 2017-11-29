import React from 'react'
import PropTypes from 'prop-types'

const Logo = ({ fontSize }) => {
  const styles = {
    color: 'white',
    fontSize: fontSize,
    fontFamily: 'Satisfy, cursive'
  }

  return (
    <div style={styles}>Esquire</div>
  )
}

Logo.propTypes = {
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Logo