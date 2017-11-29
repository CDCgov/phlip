import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Container, { Column, Row } from 'components/Layout'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'

const renderInput = ({ autoFocus, value, ref, ...other }) => {
  return (
    <TextField/>
  )
}

const SearchBar = () => {
  return (
    <Container style={{ padding: '27px 0' }}>
      <Container alignItems="center" style={{ height: 57, backgroundColor: '#e5e5e5', padding: '0 15px' }}>
        <Column flex xs>
        </Column>
        <Column>
          <Icon color="primary">search</Icon>
        </Column>
      </Container>
    </Container>
  )
}

SearchBar.propTypes = {

}

export default SearchBar