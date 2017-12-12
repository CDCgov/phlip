import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../index'
import theme from 'services/theme'

const props = {
  theme,
  user: { firstName: 'Test', lastName: 'User', role: 'Coordinator' },
  open: false,
  menuAnchor: null,
  onLogoutUser: jest.fn(),
  onToggleMenu: jest.fn(),
  onCloseMenu: jest.fn()
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <Header {...props} {...otherProps} />
    </MemoryRouter>
  )
}

describe('Header', () => {
  test('should render correctly', () => {
    expect(shallow(<Header {...props} />)).toMatchSnapshot()
  })
})