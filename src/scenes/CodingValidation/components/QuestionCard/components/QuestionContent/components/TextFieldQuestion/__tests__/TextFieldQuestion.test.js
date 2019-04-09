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

  test('should call onToggleAnswerForAnno when \'Annotate\' button is clicked', () => {
    const spy = jest.spyOn(props, 'onToggleAnswerForAnno')
    const wrapper = shallow(
      <TextFieldQuestion
        {...props}
        answerId={1}
        userAnswers={{ answers: { 1: {} } }}
      />
    )

    const button = wrapper.childAt(0).childAt(1)
    button.simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })
})
