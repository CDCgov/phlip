import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { UserHeader } from '../index'

const props = {
  user: { firstName: 'Test', lastName: 'User', role: 'Coordinator' },
  open: false,
  handleLogoutUser: jest.fn(),
  handleToggleMenu: jest.fn(),
  handleCloseMenu: jest.fn(),
  handleOpenHelpPdf: jest.fn(),
  handleOpenAdminPage: jest.fn()
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <UserHeader {...props} {...otherProps} />
    </MemoryRouter>
  )
}

describe('UserHeader', () => {
  test('should render correctly', () => {
    expect(shallow(<UserHeader {...props} />)).toMatchSnapshot()
  })
})