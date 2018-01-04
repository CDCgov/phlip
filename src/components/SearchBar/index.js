import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'

const SearchBar = ({ searchValue, handleSearchValueChange, containerStyles, placeholder, height }) => {
  const styles = {
    backgroundColor: '#e5e5e5',
    padding: '2px 10px'
  }

  return (
      <TextField
        value={searchValue}
        onChange={handleSearchValueChange}
        placeholder={placeholder}
        InputProps={{
          //disableUnderline: true,
          style: { 'alignItems': 'center'},
          endAdornment: <InputAdornment style={{ marginTop: 0, height: 24 }} position="end" disableTypography><Icon color="#c6d4da">search</Icon></InputAdornment>
        }}
        id="search-bar"
      />
  )
}

SearchBar.propTypes = {
  searchValue: PropTypes.string,
  handleSearchValueChange: PropTypes.func,
  height: PropTypes.number
}

SearchBar.defaultProps = {
  height: 57
}

export default SearchBar