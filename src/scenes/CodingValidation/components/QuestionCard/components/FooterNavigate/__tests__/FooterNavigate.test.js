import React from 'react'
import { shallow } from 'enzyme'
import { FooterNavigate } from '../index'
import theme from 'services/theme'

const props = {
  currentIndex: 0,
  getNextQuestion: () => {},
  getPrevQuestion: () => {},
  totalLength: 1,
  theme
}

describe('CodingValidation -- FooterNavigate component', () => {
  test('should render correctly', () => {
    expect(shallow(<FooterNavigate {...props} />)).toMatchSnapshot()
  })
})
