import React from 'react'
import { shallow } from 'enzyme'
import { JurisdictionForm } from '../index'

const props = {
  open: true,
  edit: false,
  jurisdiction: {},
  suggestions: [],
  suggestionValue: '',
  form: {},
  onClearSuggestions: () => {},
  onJurisdictionSelected: () => {},
  onSearchList: () => {},
  onSuggestionValueChanged: () => {},
  onHandleSubmit: () => {},
  onCloseForm: () => {}
}

describe('Home scene - AddEditJurisdictions - JurisdictionForm', () => {
  test('should render correctly', () => {
    expect(shallow(<JurisdictionForm {...props} />)).toMatchSnapshot()
  })
})