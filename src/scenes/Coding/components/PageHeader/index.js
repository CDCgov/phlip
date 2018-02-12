import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import SearchBar from 'components/SearchBar'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'
import TextLink from 'components/TextLink'

export const Header = ({ projectName, showButton, projectId, history }) => (
  <Container alignItems="center" style={{ height: '75px' }}>
    <Column style={{ paddingRight: 5 }}>
      <IconButton iconSize={30} color="black" onClick={() => history.goBack()}>arrow_back</IconButton>
    </Column>
    <Column flex>
      <Typography type="title">Coding Scheme | <span style={{ color: '#0faee6' }}>{projectName}</span></Typography>
    </Column>
    <Column>
      <SearchBar style={{ paddingRight: 20 }} placeholder="Search" />
      {showButton &&
      <TextLink to={{ pathname: `/project/${projectId}/coding-scheme/add`, state: { questionDefined: null } }}>
        <Button value="+ Add New Question" color="accent" />
      </TextLink>}
    </Column>
  </Container>
)

Header.propTypes = {
  projectName: PropTypes.string,
  showButton: PropTypes.bool,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default withRouter(Header)