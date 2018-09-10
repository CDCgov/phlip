import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const Greeting = ({ firstName, lastName, role }) => (
  <Typography style={{ color: 'white' }}>Welcome, {firstName} {lastName}! 
    <span style={{ opacity: 0.6, fontStyle: 'italic' }}>  ({role})</span>
  </Typography>
)

Greeting.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
}

export default Greeting