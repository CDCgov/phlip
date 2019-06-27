import React from 'react'
import { shallow } from 'enzyme'
import { AddEditProject } from '../index'

const props = {
  actions: {
    addProjectRequest: jest.fn()
  },
  form: {},
  projects: [],
  match: {
    url: '/project/add'
  },
  location: {
    state: {
      projectDefined: null
    }
  }
}

describe('Home scene - AddEditProject scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditProject {...props} />)).toMatchSnapshot()
  })
})
