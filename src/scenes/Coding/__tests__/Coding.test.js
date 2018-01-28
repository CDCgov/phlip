import React from 'react'
import { shallow } from 'enzyme'
import { Coding } from '../index'

const props = {
  actions: {
    getNextQuestion: () => {},
    getPrevQuestion: () => {},
    getCodingOutlineRequest: () => {},
    answerQuestionRequest: () => {},
    onChangeComment: () => {},
    onChangePincite: () => {},
    onChangeCategory: () => {},
    onClearAnswer: () => {},
    onCloseCodeScreen: () => {}
  },
  question: {},
  projectName: 'Test Project',
  projectId: 1,
  outline: {},
  currentIndex: 0,
  questionOrder: [],
  categories: [],
  selectedCategory: 0,
  jurisdictionId: 1,
  userAnswers: {}
}

describe('Coding scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Coding {...props} />)).toMatchSnapshot()
  })
})
