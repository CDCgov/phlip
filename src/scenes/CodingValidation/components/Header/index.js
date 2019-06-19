import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import theme from 'services/theme'
import { ClipboardCheckOutline } from 'mdi-material-ui'
import styles from './header-styles.scss'
import JurisdictionSelect from 'components/JurisdictionSelect'
import { Button, IconButton, Link, Icon, FlexGrid, Typography } from 'components'

export const Header = props => {
  const { empty, onJurisdictionChange, currentJurisdiction, onGoBack, pageTitle, project } = props

  return (
    <FlexGrid
      container
      type="row"
      align="center"
      justify="space-between"
      padding="15px 20px"
      style={{ minHeight: 36, height: 36 }}>
      <FlexGrid container type="row" align="center" padding="0 5 0 0">
        <IconButton iconSize={24} color="black" onClick={onGoBack} aria-label="Go back">arrow_back</IconButton>
        <Typography variant="title" style={{ fontWeight: 500, paddingRight: 10, paddingLeft: 8 }}>
          {pageTitle}
        </Typography>
        <Typography variant="title" style={{ fontWeight: 500 }}>
          <span style={{ color: theme.palette.secondary.pageHeader }}>{project.name}</span>
        </Typography>
        {!empty && <>
          <span className={styles.header} />
          <JurisdictionSelect
            options={project.projectJurisdictions}
            value={currentJurisdiction.id}
            onChange={onJurisdictionChange}
          />
          <FlexGrid container padding="0 0 0 25px">
            <Typography variant="caption">
              <span style={{ color: '#707070', letterSpacing: 0 }}>Segment Start Date </span>
              <span style={{ color: 'black' }}>{new Date(currentJurisdiction.startDate).toLocaleDateString()}</span>
            </Typography>
            <Typography variant="caption">
              <span style={{ color: '#707070', letterSpacing: 0 }}>Segment End Date </span>
              <span style={{ color: 'black' }}>{new Date(currentJurisdiction.endDate).toLocaleDateString()}</span>
            </Typography>
          </FlexGrid>
        </>}
      </FlexGrid>
      <FlexGrid container type="row">
        <Button
          style={{ backgroundColor: 'white', color: 'black' }}
          component={Link}
          to={`/project/${project.id}/protocol`}
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
  project: PropTypes.object,
  empty: PropTypes.bool,
  onJurisdictionChange: PropTypes.func,
  currentJurisdiction: PropTypes.object,
  onGoBack: PropTypes.func,
  pageTitle: PropTypes.string
}

export default withRouter(Header)
