import React from 'react'
import { shallow } from 'enzyme'
import { Admin } from '../'
import { mockUsers } from 'data/mockUsers'

const props = {
  users: [
    mockUsers
  ],
  actions: {
    getUsersRequest: jest.fn()
  }
}

describe('Admin Scene', () => {
  test('it should render correctly', () => {
    expect(shallow(<Admin {...props} />)).toMatchSnapshot()
  })
})