import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import CircleIcon from 'components/CircleIcon'
import { withRouter } from 'react-router-dom'
import { withTheme } from 'material-ui/styles'
import { Link } from 'react-router-dom'

/**
 * This is the header at the top of every page with the back button and page title
 */
export const PageHeader = props => {
  const {
    projectName, pageTitle, projectId, protocolButton,
    otherButton, children, history, checkoutButton, onBackButtonClick, theme
  } = props

  return (
    <Container alignItems="center" style={{ padding: '20px 0' }}>
      <Column style={{ paddingRight: 5 }} displayFlex>
        {pageTitle !== 'Project List'
          ? <IconButton
            iconSize={30}
            color="black"
            onClick={onBackButtonClick ? onBackButtonClick : () => history.goBack()}
            aria-label="Go back">arrow_back</IconButton>
          : <CircleIcon circleColor="error" iconColor="white" circleSize="30px" iconSize="19px">home</CircleIcon>
        }
      </Column>
      <Row displayFlex flex>
        <Typography type="title" style={{ alignSelf: 'center', paddingRight: 10 }}>{pageTitle}</Typography>
        {projectName !== '' &&
        <Fragment>
          <Typography type="title" style={{ alignSelf: 'center' }}>
            <span style={{ color: theme.palette.secondary.pageHeader }}>{projectName}</span>
          </Typography>
        </Fragment>}
      </Row>
      <Row displayFlex>
        {children}
        {protocolButton &&
        <Button
          value="Protocol"
          component={Link}
          to={`/project/${projectId}/protocol`}
          aria-label="View and Edit Protocol"
          style={{ backgroundColor: 'white', color: 'black' }}
        />}
        {checkoutButton && checkoutButton.show === true &&
        <div style={{ marginLeft: 15 }}>
          <Button value={checkoutButton.text} color="accent" {...checkoutButton.props} />
        </div>}
        {otherButton.show && <div style={{ marginLeft: 15 }}>{otherButton.isLink
          ? <Button
            value={otherButton.text}
            color="accent"
            component={Link}
            to={{ pathname: `${otherButton.path}`, state: { ...otherButton.state } }} {...otherButton.props}
          />
          : <Button
            value={otherButton.text}
            color="accent"
            style={otherButton.style}
            onClick={otherButton.onClick} {...otherButton.props}
          />}</div>
        }
      </Row>
    </Container>
  )
}

PageHeader.propTypes = {
  /**
   * Name of the project
   */
  projectName: PropTypes.string,
  /**
   * Title of the page to be displayed next to projectName
   */
  pageTitle: PropTypes.string,
  /**
   * ID of project for this page
   */
  projectId:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Whether or not to show the Protocol button
   */
  protocolButton: PropTypes.bool,
  /**
   * Any other button to show
   */
  otherButton: PropTypes.object,
  /**
   * This should be anything that you want to display between the protocol button and project name / page title
   */
  children: PropTypes.any,
  /**
   * Browser history object
   */
  history: PropTypes.object,
  /**
   * For coding scheme and 'checkout' button will be shown
   */
  checkoutButton: PropTypes.object,
  /**
   * If defined, when clicking the back button this function will be called instead of just history.goBack()
   */
  onBackButtonClick: PropTypes.func,
  /**
   * Theme object provided by material-ui
   */
  theme: PropTypes.object
}

export default withRouter(withTheme()(PageHeader))