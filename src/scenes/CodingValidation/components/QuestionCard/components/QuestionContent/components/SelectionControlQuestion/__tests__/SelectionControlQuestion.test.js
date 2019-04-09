import React from 'react'
import { shallow } from 'enzyme'
import { SelectionControlQuestion } from '../index'

const props = {
  choices: [],
  userAnswers: {},
  onChange: jest.fn(),
  onChangePincite: jest.fn(),
  mergedUserQuestions: {},
  disableAll: false,
  userImages: {},
  question: {},
  classes: {},
  enabledAnswerChoice: 3,
  onToggleAnswerForAnno: jest.fn(),
  areDocsEmpty: false
}

describe('QuestionCard - QuestionContent - SelectionControlQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<SelectionControlQuestion {...props} />)).toMatchSnapshot()
  })
})
