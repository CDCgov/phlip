import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import AppBar from 'components/AppBar'
import styles from './header-styles.scss'
import Select from 'material-ui/Select'
import JurisdictionSelect from '../JurisdictionSelect'
import Container, { Column } from 'components/Layout'

export const Header = ({ projectName, projectId, jurisdictionsList, selectedJurisdiction, onJurisdictionChange, currentJurisdiction }) => (
  <AppBar>
    <Typography type="title" color="inherit" style={{ flex: 2 }}>
      <span style={{ color: '#0faee6' }}>{projectName}</span><span className={styles.header} />
      <JurisdictionSelect options={jurisdictionsList} value={selectedJurisdiction} onChange={onJurisdictionChange} style={{ marginLeft: '40px' }} />
    </Typography>
    <Column >
      <Typography type="caption" color="default" align="right">
        Segment start <span style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
      </Typography>
      <Typography type="caption" color="default" align="right">
        Segment end <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
      </Typography>
    </Column>
    <Column flex></Column>
    <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} />
  </AppBar>
)

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jurisdictionsList: PropTypes.arrayOf(PropTypes.object)
}

export default Header