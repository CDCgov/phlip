import React from 'react'
import { shallow, mount } from 'enzyme'
import { HeaderedLayout } from '../index'

const props = {
  actions: {
    logoutUser: jest.fn(),
    openMenu: jest.fn(),
    closeMenu: jest.fn()
  },
  open: false,
  menuAnchor: null
}

describe('HeaderedLayout', () => {
  test('it should render correctly', () => {
    expect(shallow(<HeaderedLayout {...props} />)).toMatchSnapshot()
  })
})