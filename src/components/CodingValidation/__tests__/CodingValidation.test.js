import React from 'react'
import { shallow } from 'enzyme'
import { withCodingValidation } from '../index'
import Coding from 'scenes/Coding'

const props = {
  projectName: 'Project Test',
  page: 'coding',
  isValidation: false,
  projectId: 1,
  question: { id: 1, text: 'question!' },
  currentIndex: 0,
  questionOrder: [1],
  showNextButton: false,
  jurisdictionsList: [{ id: 11 }],
  jurisdictionId: 11,
  jurisdiction: { id: 11 },
  isSchemeEmpty: false,
  areJurisdictionsEmpty: false,
  userRole: 'Admin',
  user: { id: 11, role: 'Admin' },
  selectedCategory: null,
  schemeError: null,
  updateAnswerError: null,
  answerErrorContent: null,
  saveFlagErrorContent: null,
  getQuestionErrors: null,
  match: { url: '/project/1/code', params: { id: 1 } },
  actions: {}
}

const Component = withCodingValidation(Coding, {}).WrappedComponent

describe('CodingValidation', () => {
  test('should render Coding component correctly', () => {
    expect(shallow(<Component {...props} />)).toMatchSnapshot()
  })
})