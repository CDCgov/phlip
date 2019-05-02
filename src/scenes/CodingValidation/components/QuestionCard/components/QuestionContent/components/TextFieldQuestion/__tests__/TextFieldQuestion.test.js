import React from 'react'
import { shallow } from 'enzyme'
import { TextFieldQuestion } from '../index'

const props = {
  onChange: jest.fn(),
  name: '',
  answerId: 10,
  userImages: {},
  onToggleAnnotationMode: jest.fn(),
  enabledAnswerId: 0,
  annotationModeEnabled: false,
  areDocsEmpty: false,
  mergedUserQuestions: null,
  userAnswers: { answers: {} },
  disableAll: false
}

describe('QuestionCard - QuestionContent - TextFieldQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<TextFieldQuestion {...props} />)).toMatchSnapshot()
  })
  
  test('should call onToggleAnnotationMode when \'Annotate\' button is clicked', () => {
    const spy = jest.spyOn(props, 'onToggleAnnotationMode')
    const wrapper = shallow(<TextFieldQuestion {...props} answerId={1} userAnswers={{ answers: { 1: {} } }} />)
    const button = wrapper.find('WithTheme(Button)')
    button.simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })
})
