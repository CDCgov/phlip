import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
//import Typography from '@material-ui/core/Typography'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import { ClipboardCheckOutline } from 'mdi-material-ui'
import styles from './header-styles.scss'
import JurisdictionSelect from 'components/JurisdictionSelect'
import { Button, IconButton, Link, Icon, FlexGrid, Typography } from 'components'

export const Header = props => {
  const {
    projectName, empty, projectId, jurisdictionList, onJurisdictionChange,
    currentJurisdiction, onGoBack, pageTitle, theme
  } = props

  return (
    <FlexGrid
      container
      type="row"
      align="center"
      justify="space-between"
      padding="12px 20px"
      style={{ minHeight: 36, height: 36 }}>
      <FlexGrid container type="row" align="center" padding="0 5 0 0">
        <IconButton iconSize={24} color="black" onClick={onGoBack} aria-label="Go back">arrow_back</IconButton>
        <Typography variant="title2" style={{ fontWeight: 500, paddingRight: 10, paddingLeft: 8 }}>
          {pageTitle}
        </Typography>
        <Typography variant="title2" style={{ fontWeight: 500 }}>
          <span style={{ color: theme.palette.secondary.pageHeader }}>{projectName}</span>
        </Typography>
        {!empty && <>
          <span className={styles.header} />
          <JurisdictionSelect
            options={jurisdictionList}
            value={currentJurisdiction.id}
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
      <FlexGrid container type="row">
        <Button
          style={{ backgroundColor: 'white', color: 'black' }}
          component={Link}
          to={`/project/${projectId}/protocol`}
          aria-label="View and edit protocol">
          <span style={{ paddingRight: 5 }}>Protocol</span>
          <Icon color="black"><ClipboardCheckOutline /></Icon>
        </Button>
      </FlexGrid>
    </FlexGrid>
  )
}

Header.defaultProps = {}

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jurisdictionList: PropTypes.arrayOf(PropTypes.object)
}

export default withRouter(withTheme()(Header))