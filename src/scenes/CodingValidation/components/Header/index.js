import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import styles from './header-styles.scss'
import JurisdictionSelect from 'components/JurisdictionSelect'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'
import Link from 'components/Link'
import Icon from 'components/Icon'
import { withTheme } from '@material-ui/core/styles'
import { ClipboardCheckOutline } from 'mdi-material-ui'
import FlexGrid from 'components/FlexGrid'

export const Header = props => {
  const {
    projectName, empty, projectId, jurisdictionsList, selectedJurisdiction, onJurisdictionChange,
    currentJurisdiction, onGoBack, pageTitle, theme
  } = props

  return (
    <FlexGrid container type="row" align="center" justify="space-between" padding="20px 27px" style={{ minHeight: 40 }}>
      <FlexGrid container type="row" padding="0 5 0 0">
        <IconButton iconSize={30} color="black" onClick={onGoBack} aria-label="Go back">arrow_back</IconButton>
        <Typography variant="title" style={{ alignSelf: 'center', paddingRight: 10 }}>{pageTitle}</Typography>
        <Typography variant="title" style={{ alignSelf: 'center' }}>
          <span style={{ color: theme.palette.secondary.pageHeader }}>{projectName}</span>
        </Typography>
        {!empty && <>
          <span className={styles.header} />
          <JurisdictionSelect
            options={jurisdictionsList}
            value={selectedJurisdiction}
            onChange={onJurisdictionChange}
          />
          <FlexGrid container padding="0 0 0 25px">
            <Typography variant="caption">
              <span style={{ color: '#707070' }}>Segment Start Date </span>
              <span style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
            </Typography>
            <Typography variant="caption">
              <span style={{ color: '#707070' }}>Segment End Date </span>
              <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
            </Typography>
          </FlexGrid>
        </>}
      </FlexGrid>
      <Button
        style={{ backgroundColor: 'white', color: 'black' }}
        component={Link}
        to={`/project/${projectId}/protocol`}
        aria-label="View and edit protocol">
        <span style={{ paddingRight: 5 }}>Protocol</span><Icon color="black"><ClipboardCheckOutline /></Icon>
      </Button>
    </FlexGrid>
  )
}

Header.defaultProps = {}

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jurisdictionsList: PropTypes.arrayOf(PropTypes.object)
}

export default withRouter(withTheme()(Header))