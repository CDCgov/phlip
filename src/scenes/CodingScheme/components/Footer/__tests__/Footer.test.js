import React from 'react'
import { shallow } from 'enzyme'
import { Footer } from '../index'

describe('CodingScheme -- Footer component', () => {
  test('should render correctly', () => {
    expect(shallow(<Footer />)).toMatchSnapshot()
  })
})
