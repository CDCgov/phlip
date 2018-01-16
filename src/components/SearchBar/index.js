import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'

const SearchBar = ({ searchValue, handleSearchValueChange, placeholder, ...otherProps }) => {
  return (
    <TextField
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder={placeholder}
      InputProps={{
        style: { 'alignItems': 'center' },
        endAdornment: <InputAdornment style={{ marginTop: 0, height: 24 }} position="end" disableTypography><Icon color="#c6d4da">search</Icon></InputAdornment>
      }}
      type="search"
      id="search-bar"
      {...otherProps}
    />
  )
}

SearchBar.propTypes = {
  searchValue: PropTypes.string,
  handleSearchValueChange: PropTypes.func,
  placeholder: PropTypes.string
}

SearchBar.defaultProps = {}

export default SearchBar