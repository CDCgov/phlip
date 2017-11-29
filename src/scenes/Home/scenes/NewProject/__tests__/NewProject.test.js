import React from 'react'
import { shallow } from 'enzyme'
import { NewProject } from '../index'

const props = {
  actions: {
    addProjectRequest: jest.fn()
  },
  form: {},
  projects: []
}

describe('Home -- New Project scene', () => {
  test('it should render correctly', () => {
    expect(shallow(<NewProject {...props} />)).toMatchSnapshot()
  })
})