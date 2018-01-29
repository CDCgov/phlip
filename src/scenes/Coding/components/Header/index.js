import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import AppBar from 'components/AppBar'
import styles from './header-styles.scss'

export const Header = ({ projectName, projectId }) => (
  <AppBar>
    <Typography type="title" color="inherit" style={{ flex: 1 }}>
      <span style={{ color: '#0faee6' }}>{projectName}</span><span className={styles.header} />
    </Typography>
    <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} />
  </AppBar>
)

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Header