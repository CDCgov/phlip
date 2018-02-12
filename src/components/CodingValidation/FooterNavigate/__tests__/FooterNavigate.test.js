import React from 'react'
import { shallow } from 'enzyme'
import { FooterNavigate } from '../index'

const props = {
  currentIndex: 0,
  getNextQuestion: () => {},
  getPrevQuestion: () => {},
  totalLength: 1
}

describe('Coding -- FooterNavigate component', () => {
  test('should render correctly', () => {
    expect(shallow(<FooterNavigate {...props} />)).toMatchSnapshot()
  })
})
