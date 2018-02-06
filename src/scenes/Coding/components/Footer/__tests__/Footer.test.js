import React from 'react'
import { shallow } from 'enzyme'
import { Footer } from '../index'

const props = {
  onClose: () => {}
}

describe('Coding -- Footer component', () => {
  test('should render correctly', () => {
    expect(shallow(<Footer {...props} />)).toMatchSnapshot()
  })
})
