import React from 'react'
import { shallow } from 'enzyme'
import { Navigator } from '../index'

const props = {
  onQuestionSelected: () => {},
  question: {},
  selectedCategory: 0,
  userAnswers: {},
  scheme: { tree: [] },
  classes: { codeNav: '' }
}

describe('Coding scene - Navigator', () => {
  test('should render correctly', () => {
    expect(shallow(<Navigator {...props} />)).toMatchSnapshot()
  })
})
