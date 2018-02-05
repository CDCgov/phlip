import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import AppBar from 'components/AppBar'
import styles from './header-styles.scss'
import Select from 'material-ui/Select'
import JurisdictionSelect from 'components/JurisdictionSelect'
import Container, { Column } from 'components/Layout'

export const Header = ({ projectName, empty, projectId, jurisdictionsList, selectedJurisdiction, onJurisdictionChange, currentJurisdiction, isValidation }) => (
  <AppBar>
    {isValidation ? <Typography type="title" color="inherit">
      <span style={{ color: '#FDB760', paddingRight: 10 }}>VALIDATION</span>
    </Typography> : <div></div>}
    <Typography type="title" color="inherit">
      <span style={{ color: '#0faee6' }}>{projectName}</span>
    </Typography>
    {!empty && <Fragment><span className={styles.header} />
      <div style={{ flex: '1' }}>
        <JurisdictionSelect options={jurisdictionsList} value={selectedJurisdiction} onChange={onJurisdictionChange} />
      </div>
      <Column>
        <Typography type="caption" color="default" align="right">
          Segment start <span
            style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
        </Typography>
        <Typography type="caption" color="default" align="right">
          Segment end <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
        </Typography>
      </Column>
      <Column flex></Column>
      <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} /></Fragment>}
  </AppBar>
)

Header.defaultProps = {
  isValidation: false
}

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jurisdictionsList: PropTypes.arrayOf(PropTypes.object),
  isValidation: PropTypes.bool
}

export default Header