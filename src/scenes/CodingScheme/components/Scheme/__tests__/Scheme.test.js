import React from 'react'
import { shallow } from 'enzyme'
import { Scheme } from '../index'

const props = {
  questions: [],
  handleQuestionTreeChange: () => {},
  handleHoverOnQuestion: () => {},
  enableHover: () => {},
  disableHover: () => {}
}

describe('CodingScheme scene -- Scheme component', () => {
  test('should render correctly', () => {
    expect(shallow(<Scheme {...props} />)).toMatchSnapshot()
  })
})
