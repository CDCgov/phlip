import React from 'react'
import { shallow } from 'enzyme'
import { TextFieldQuestion } from '../index'

const props = {
  onChange: jest.fn(),
  name: '',
  answerId: 10,
  userImages: {},
  onToggleAnswerForAnno: jest.fn(),
  enabledAnswerChoice: 0,
  areDocsEmpty: false,
  mergedUserQuestions: null,
  userAnswers: { answers: {} },
  disableAll: false
}

describe('QuestionCard - QuestionContent - TextFieldQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<TextFieldQuestion {...props} />)).toMatchSnapshot()
  })
})
