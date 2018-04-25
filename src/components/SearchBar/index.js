import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import { withTheme } from 'material-ui/styles'

const SearchBar = ({ searchValue, handleSearchValueChange, placeholder, theme, ...otherProps }) => {
  return (
    <TextField
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder={placeholder}
      InputProps={{
        style: { 'alignItems': 'center' },
        endAdornment:
          <InputAdornment
            style={{ marginTop: 0, height: 24 }}
            position="end"
            disableTypography><Icon color={theme.palette.greyText}>search</Icon>
          </InputAdornment>,
        inputProps: { 'aria-label': 'Search' }
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

export default withTheme()(SearchBar)