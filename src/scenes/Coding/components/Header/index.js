import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button/index'
import AppBar from 'components/AppBar/index'

export const Header = ({ projectName, projectId }) => (
  <AppBar>
    <Typography type="title" color="inherit" style={{ flex: 1 }}>
      <span style={{ color: '#0faee6' }}>{projectName}</span> |
    </Typography>
    <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} />
  </AppBar>
)

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Header