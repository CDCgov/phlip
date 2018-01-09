import React from 'react'
import { shallow, mount } from 'enzyme'
import { CodingScheme } from '../index'

const props = {
  actions: {
    getSchemeRequest: () => {},
    toggleHover: () => {},
    updateQuestionTree: () => {}
  },
  questions: {}
}

describe('CodingScheme scene', () => {
  test('should render correctly', () => {
    expect(shallow(<CodingScheme {...props} />)).toMatchSnapshot()
  })
})
