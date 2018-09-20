import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { HeaderTabs } from '../index'

const props = {
  tabs: [
    {
      label: 'Project List',
      active: true,
      location: '/home',
      icon: 'dvr'
    },
    {
      label: 'Document Management',
      active: false,
      location: '/docs',
      icon: 'description'
    }
  ],
  onTabChange: (i) => {}
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <HeaderTabs {...props} {...otherProps} />
    </MemoryRouter>
  )
}

describe('HeaderTabs', () => {
  test('should render correctly', () => {
    expect(shallow(<HeaderTabs {...props} />)).toMatchSnapshot()
  })
})