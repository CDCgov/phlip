import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import CircleIcon from 'components/CircleIcon'
import { withRouter } from 'react-router-dom'
import TextLink from 'components/TextLink'
import { withTheme } from 'material-ui/styles'

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
            <span style={{ color: theme.palette.secondary.main }}>{projectName}</span>
          </Typography>
        </Fragment>}
      </Row>
      <Row displayFlex>
        {children}
        {protocolButton && <div style={{ paddingRight: 15 }}>
          <TextLink to={`/project/${projectId}/protocol`}>
            <Button
              value="View/Edit Protocol"
              aria-label="View and Edit Protocol"
              style={{ backgroundColor: 'white', color: 'black' }} />
          </TextLink>
        </div>}
        {checkoutButton && checkoutButton.show === true &&
        <div style={{ marginRight: 15 }}>
          <Button value={checkoutButton.text} color="accent" {...checkoutButton.props} />
        </div>}
        {otherButton.show && (otherButton.isLink
          ? <TextLink to={{ pathname: `${otherButton.path}`, state: { ...otherButton.state } }}>
            <Button value={otherButton.text} color="accent" {...otherButton.props} />
          </TextLink>
          : <Button
            value={otherButton.text}
            color="accent"
            style={otherButton.style}
            onClick={otherButton.onClick} {...otherButton.props} />)
        }
      </Row>
    </Container>
  )
}

PageHeader.propTypes = {
  projectName: PropTypes.string,
  showButton: PropTypes.bool,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBackButtonClick: PropTypes.func
}

export default withRouter(withTheme()(PageHeader))