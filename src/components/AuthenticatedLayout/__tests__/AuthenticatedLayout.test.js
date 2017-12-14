import React from 'react'
import { shallow, mount } from 'enzyme'
import { AuthenticatedLayout } from '../index'

const props = {
  actions: {
    logoutUser: jest.fn(),
    openMenu: jest.fn(),
    closeMenu: jest.fn()
  },
  open: false,
  menuAnchor: null
}

describe('AuthenticatedLayout', () => {
  test('it should render correctly', () => {
    expect(shallow(<AuthenticatedLayout {...props} />)).toMatchSnapshot()
  })
})