import React from 'react'
import { shallow } from 'enzyme'
import { Admin } from '../index'

const props = {
  users: [],
  actions: {
    getUsersRequest: jest.fn()
  },
  sortBy: 'name',
  direction: 'asc',
  page: 0,
  rowsPerPage: 10
}

describe('Admin Scene', () => {
  test('it should render correctly', () => {
    expect(shallow(<Admin {...props} />)).toMatchSnapshot()
  })

  test('should render UserList component', () => {
    const wrapper = shallow(<Admin {...props} />)
    expect(wrapper.find('UserList')).toHaveLength(1)
  })
})