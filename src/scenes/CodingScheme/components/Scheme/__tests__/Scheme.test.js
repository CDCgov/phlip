import React from 'react'
import { shallow, mount } from 'enzyme'
import { Scheme } from '../index'

const props = {
  questions: {},
  handleQuestionTreeChange: () => {},
  handleHoverOnQuestion: () => {}
}

describe('CodingScheme scene -- Scheme component', () => {
  test('should render correctly', () => {
    expect(shallow(<Scheme {...props} />)).toMatchSnapshot()
  })
})
