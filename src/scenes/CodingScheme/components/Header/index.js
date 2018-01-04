import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import AppBar from 'components/AppBar'

export const Header = ({ projectName, handleAddQuestion }) => (
  <AppBar>
    <Typography type="title" color="inherit" style={{ flex: 1 }}>
      Coding Scheme | <span style={{ color: '#0faee6' }}>{projectName}</span>
    </Typography>
    <Button value="+ Add New Question" color="accent" onClick={() => handleAddQuestion() } />
  </AppBar>
)
Header.propTypes = {
  projectName: PropTypes.string,
  handleAddQuestion: PropTypes.func
}

export default Header