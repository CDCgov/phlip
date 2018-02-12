import React from 'react'
import { shallow } from 'enzyme'
import { QuestionCard } from '../index'

const props = {
  question: {},
  userAnswers: {},
  categories: undefined,
  selectedCategory: 0,
  onClearAnswer: () => {},
  onChangeCategory: () => {},
  onChange: () => {},
  onChangeTextAnswer: () => {}
}

describe('Coding scene --- QuestionCard component', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionCard {...props} />)).toMatchSnapshot()
  })
})
