import React from 'react'
import { shallow } from 'enzyme'
import { QuestionContent } from '../index'

const props = {
  question: {
    questionType: 1,
    text: 'Are tags issued after rabies vaccination?',
    hint: '',
    includeComment: false,
    possibleAnswers: [{ id: 1010, text: 'Yes' }, { id: 1011, text: 'No' }],
    id: 1045341
  },
  userAnswers: {},
  comment: 'Comment here!',
  onChange: () => {},
  onChangeTextAnswer: () => {}
}

xdescribe('Coding scene --- QuestionContent component', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionContent {...props} />)).toMatchSnapshot()
  })
})
