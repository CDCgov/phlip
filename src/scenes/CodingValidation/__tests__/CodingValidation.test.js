import React from 'react'
import { shallow } from 'enzyme'
import { CodingValidation } from '../index'

const props = {
  project: { id: 1, name: 'Project Test', projectJurisdictions: [{ id: 11 }] },
  page: 'coding',
  isValidation: false,
  question: { id: 1, text: 'question!' },
  currentIndex: 0,
  questionOrder: [1],
  showNextButton: false,
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
  actions: {
    getCodingOutlineRequest: jest.fn(),
    setPage: jest.fn()
  },
  classes: {}
}

describe('CodingValidation', () => {
  test('should render Coding component correctly', () => {
    expect(shallow(<CodingValidation {...props} />)).toMatchSnapshot()
  })
})
