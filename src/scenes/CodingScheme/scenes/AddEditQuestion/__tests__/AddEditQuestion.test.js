import React from 'react'
import { shallow } from 'enzyme'
import { AddEditQuestion } from '../index'

const props = {
  actions: {
    updateQuestionRequest: jest.fn(),
    addChildQuestionRequest: jest.fn(),
    addQuestionRequest: jest.fn()
  },
  match: { url: '/project/2/coding-scheme/add' },
  formActions: {
    reset: jest.fn()
  },
  location: {
    state: {}
  },
  form: {}
}

describe('CodingScheme scene - AddEditQuestion Component', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditQuestion {...props} />)).toMatchSnapshot()
  })
})
