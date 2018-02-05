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

const editProps = {
  ...props,
  match: {
    url: '/project/edit/1'
  },
  location: {
    state: {
      projectDefined: {
        name: 'Project Name',
        id: 1,
        type: 1
      }
    }
  }
}

describe('Home scene - AddEditProject scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditProject {...props} />)).toMatchSnapshot()
  })

  test('should only show the last two rows if projectDefined is defined', () => {
    const details = shallow(<AddEditProject {...editProps} />)
    const newForm = shallow(<AddEditProject {...props} />)
    expect(details.find('DetailRow').length).toBe(4)
    expect(newForm.find('DetailRow').length).toBe(2)
  })
})