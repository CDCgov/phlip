import React from 'react'
import { shallow } from 'enzyme'
import { SelectionControlQuestion } from '../index'

const props = {
  choices: [],
  userAnswers: {},
  onChange: jest.fn(),
  onChangePincite: jest.fn(),
  mergedUserQuestions: null,
  disableAll: false,
  userImages: {},
  question: {},
  classes: {},
  enabledAnswerId: 3,
  onToggleAnnotationMode: jest.fn(),
  annotationModeEnabled: false,
  areDocsEmpty: false
}

describe('QuestionCard - QuestionContent - SelectionControlQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<SelectionControlQuestion {...props} />)).toMatchSnapshot()
  })

  test('should call onToggleAnnotationMode when \'Annotate\' button is clicked', () => {
    const spy = jest.spyOn(props, 'onToggleAnnotationMode')
    const wrapper = shallow(
      <SelectionControlQuestion
        {...props}
        choices={[{ id: 1, text: 'answer choice 1' }]}
        userAnswers={{ answers: { 1: {} } }}
      />
    )
    const button = wrapper.find('FlexGrid').at(2).childAt(0)
    button.simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })
})
