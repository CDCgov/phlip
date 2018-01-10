import React from 'react'
import { shallow } from 'enzyme'
import { Header } from '../index'

const props = {
  projectName: 'Test Project',
  handleAddQuestion: () => {}
}

describe('CodingScheme scene --- Header component', () => {
  test('should render correctly', () => {
    expect(shallow(<Header {...props} />)).toMatchSnapshot()
  })
})
