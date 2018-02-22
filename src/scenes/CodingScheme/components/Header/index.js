import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'
import TextLink from 'components/TextLink'
import styles from 'components/CodingValidation/Header/header-styles.scss'

export const Header = ({ projectName, showButton, projectId, history }) => (
  <Container alignItems="center" style={{ height: '80px' }}>
    <Column style={{ paddingRight: 5 }}>
      <IconButton iconSize={30} color="black" onClick={() => history.push('/')}>arrow_back</IconButton>
    </Column>
    <Row displayFlex flex>
      <Typography type="title" style={{ alignSelf: 'center' }}>Coding Scheme</Typography>
      <span className={styles.header} />
      <Typography type="title" style={{ alignSelf: 'center' }}><span style={{ color: '#0faee6' }}>{projectName}</span></Typography>
    </Row>
    <Row displayFlex>
      <div style={{ paddingRight: 15 }}>
        <TextLink to={`/project/${projectId}/protocol`}>
          <Button value="View/Edit Protocol" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} />
        </TextLink>
      </div>
      {showButton &&
      <TextLink to={{ pathname: `/project/${projectId}/coding-scheme/add`, state: { questionDefined: null } }}>
        <Button value="+ Add New Question" color="accent" />
      </TextLink>}
    </Row>
  </Container>
)

Header.propTypes = {
  projectName: PropTypes.string,
  showButton: PropTypes.bool,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default withRouter(Header)