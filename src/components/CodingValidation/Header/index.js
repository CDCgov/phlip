import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import styles from './header-styles.scss'
import JurisdictionSelect from 'components/JurisdictionSelect'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'
import TextLink from 'components/TextLink'
import { withTheme } from 'material-ui/styles'

export const Header = props => {
  const {
    projectName, empty, projectId, jurisdictionsList, selectedJurisdiction, onJurisdictionChange,
    currentJurisdiction, isValidation, history, pageTitle, theme
  } = props

  return (
    <Container alignItems="center" style={{ padding: '20px 27px' }}>
      <Column style={{ paddingRight: 5, display: 'flex' }}>
        <IconButton
          iconSize={30}
          color="black"
          onClick={() => history.goBack()}
          aria-label="Go back">arrow_back</IconButton>
      </Column>
      <Row displayFlex>
        <Typography type="title" style={{ alignSelf: 'center', paddingRight: 10 }}>{pageTitle}</Typography>
        <Typography type="title" style={{ alignSelf: 'center' }}>
          <span style={{ color: theme.palette.secondary.main }}>{projectName}</span>
        </Typography>
      </Row>
      <Fragment>
        {!empty && <Fragment><span className={styles.header} />
          <div style={{ flex: '1', paddingRight: 30 }}>
            <JurisdictionSelect
              options={jurisdictionsList}
              value={selectedJurisdiction}
              onChange={onJurisdictionChange} />
          </div>
          <Column>
            <Typography type="caption" color="default">
              Segment Start Date <span style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
            </Typography>
            <Typography type="caption" color="default">
              Segment End Date <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
            </Typography>
          </Column></Fragment>}
        <Column flex></Column>
        <TextLink to={`/project/${projectId}/protocol`}>
          <Button
            value="Protocol"
            style={{ backgroundColor: 'white', color: 'black' }}
            aria-label="View and edit protocol" />
        </TextLink>
      </Fragment>
    </Container>
  )
}

Header.defaultProps = {
  isValidation: false
}

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jurisdictionsList: PropTypes.arrayOf(PropTypes.object),
  isValidation: PropTypes.bool
}

export default withRouter(withTheme()(Header))