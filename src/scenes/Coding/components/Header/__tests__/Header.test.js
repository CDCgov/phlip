import React from 'react'
import { shallow } from 'enzyme'
import { Header } from '../index'

const props = {
  projectName: 'Test Project',
  projectId: 1,
  currentJurisdiction: {
    startDate: '2018-01-01T10:00:00',
    endDate: '2018-01-18T05:00:00'
  }
}

describe('Coding scene --- Header component', () => {
  test('should render correctly', () => {
    expect(shallow(<Header {...props} />)).toMatchSnapshot()
  })
})
