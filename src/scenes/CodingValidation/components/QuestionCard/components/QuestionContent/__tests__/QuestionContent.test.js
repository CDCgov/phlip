import React from 'react'
import { shallow } from 'enzyme'
import { QuestionContent } from '../index'
import * as questionTypes from '../../../../../constants'

const props = {
  question: {
    hint: null,
    questionType: questionTypes.MULTIPLE_CHOICES
  }
}

describe('QuestionCard - QuestionContent', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionContent {...props} />)).toMatchSnapshot()
  })
})