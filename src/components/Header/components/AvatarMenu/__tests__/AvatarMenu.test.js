import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { AvatarMenu } from '../index'

const props = {
  role: 'Admin',
  initials: 'TU',
  open: false,
  menuAnchor: null,
  onLogoutUser: jest.fn(),
  onToggleMenu: jest.fn(),
  onCloseMenu: jest.fn()
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <AvatarMenu {...props} {...otherProps} />
    </MemoryRouter>
  )
}

describe('Header -- AvatarMenu', () => {
  test('should render correctly', () => {
    expect(shallow(<AvatarMenu {...props} />)).toMatchSnapshot()
  })

  test('should call to open menu when Avatar is clicked', () => {
    const wrapper = setup()
    wrapper.find('Avatar').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('AvatarMenu').prop('onToggleMenu')).toHaveBeenCalled()
  })
})