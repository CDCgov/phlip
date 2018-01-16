import React from 'react'
import { shallow } from 'enzyme'
import { AddEditJurisdictions } from '../index'

const props = {
  actions: {
    getProjectJurisdictions: jest.fn()
  },
  project: {}
}

describe('Home scene - AddEditJurisdictions scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditJurisdictions {...props} />)).toMatchSnapshot()
  })
})