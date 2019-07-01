import React from 'react'
import { shallow } from 'enzyme'
import { AddEditProject } from '../index'

const props = {
  actions: {
    addProjectRequest: jest.fn(),
    setCurrentUsers: jest.fn()
  },
  form: {},
  users: [],
  projects: [],
  match: {
    url: '/project/add'
  },
  location: {
    state: {
      projectDefined: null
    }
  },
  currentUser: {
    userId: 32
  }
}

describe('Home scene - AddEditProject scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditProject {...props} />)).toMatchSnapshot()
  })
})
