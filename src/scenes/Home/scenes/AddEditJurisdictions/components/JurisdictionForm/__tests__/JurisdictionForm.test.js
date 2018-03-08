import React from 'react'
import { shallow } from 'enzyme'
import { JurisdictionForm } from '../index'

const props = {
  form: {},
  formName: 'jurisdictionForm',
  jurisdiction: {},
  jurisdictions: [],
  suggestions: [],
  suggestionValue: '',
  actions: {},
  formActions: {},
  location: { state: undefined },
  match: {},
  history: {},
  onCloseModal: () => {}
}

describe('Home scene - AddEditJurisdictions - JurisdictionForm', () => {
  test('should render correctly', () => {
    expect(shallow(<JurisdictionForm {...props} />)).toMatchSnapshot()
  })
})