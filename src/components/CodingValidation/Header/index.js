import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import styles from './header-styles.scss'
import JurisdictionSelect from 'components/JurisdictionSelect'
import Container, { Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'

export const Header = ({ projectName, empty, projectId, jurisdictionsList, selectedJurisdiction, onJurisdictionChange, currentJurisdiction, isValidation, history }) => (
  <Container alignItems="center" style={{ height: '80px', padding: isValidation ? '' : '20px 27px' }}>
    <Column style={{ paddingRight: 5 }}>
      <IconButton iconSize={30} color="black" onClick={() => history.push('/')}>arrow_back</IconButton>
    </Column>
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
      <Column flex>
        <Typography type="caption" color="default" align="right">
          Segment start <span style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
        </Typography>
        <Typography type="caption" color="default" align="right">
          Segment end <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
        </Typography>
      </Column>
      <Column flex></Column>
      <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} /></Fragment>}
  </Container>
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

export default withRouter(Header)