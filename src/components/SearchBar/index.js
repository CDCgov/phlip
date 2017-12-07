import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'

const SearchBar = ({ searchValue, handleSearchValueChange, height }) => {
  const styles = {
    backgroundColor: '#e5e5e5',
    padding: '0 15px',
    height
  }

  return (
    <Container style={{ padding: '27px 0' }}>
      <Container alignItems="center" style={styles}>
        <Column flex xs>
          <TextField
            value={searchValue}
            onChange={handleSearchValueChange}
            InputProps={{ disableUnderline: true }}
            id="search-bar"
            fullWidth
          />
        </Column>
        <Column>
          <Icon color="primary">search</Icon>
        </Column>
      </Container>
    </Container>
  )
}

SearchBar.propTypes = {
  searchValue: PropTypes.string,
  handleSearchChange: PropTypes.func,
  height: PropTypes.number
}

SearchBar.defaultProps = {
  height: 57
}

export default SearchBar