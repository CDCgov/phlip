import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import AppBar from 'components/AppBar'
import SearchBar from 'components/SearchBar'
import TextLink from 'components/TextLink'

export const Header = ({ projectName, projectId }) => (
  <AppBar>
    <Typography type="title" color="inherit" style={{ flex: 1 }}>
      Coding Scheme | <span style={{ color: '#0faee6' }}>{projectName}</span>
    </Typography>
    <SearchBar style={{ paddingRight: 10 }} placeholder="Search keywords" />
    <TextLink to={`/project/${projectId}/coding-scheme/add`}>
      <Button value="+ Add New Question" color="accent" />
    </TextLink>
  </AppBar>
)

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Header