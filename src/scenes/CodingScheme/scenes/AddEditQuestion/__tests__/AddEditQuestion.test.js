import React from 'react'
import { shallow, mount } from 'enzyme'
import { AddEditQuestion } from '../index'

const props = {
  actions: {
    updateQuestionRequest: () => { },
    addChildQuestionRequest: () => { },
    addQuestionRequest: () => { }
  },
  match: {
    url: '`/project/2/coding-scheme/add`'
  },
  formActions: {
    reset: () => { }
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