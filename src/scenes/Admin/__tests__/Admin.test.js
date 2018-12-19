import React from 'react'
import { shallow } from 'enzyme'
import { Admin } from '../'
import { UserList } from '../components/UserList'
import { PageHeader } from 'components/PageHeader'

const props = {
  users: [],
  actions: {
    getUsersRequest: jest.fn()
  },
  sortBy: 'name',
  direction: 'asc',
  page: 0,
  rowsPerPage: 10,
}

describe('Admin Scene', () => {
  test('it should render correctly', () => {
    expect(shallow(<Admin {...props} />)).toMatchSnapshot()
  })

  xtest('should render UserList component', () => {
    let wrapper = shallow(<Admin {...props} />)
    expect(wrapper.find(UserList)).toHaveLength(1)
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })
})