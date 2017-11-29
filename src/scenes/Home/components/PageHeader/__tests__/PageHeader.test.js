import React from 'react'
import { shallow, mount } from 'enzyme'
import { PageHeader } from '../index'
import { MemoryRouter } from 'react-router-dom'
import Button from 'components/Button'

const setup = props => {
  return mount(
    <MemoryRouter>
      <PageHeader {...props} />
    </MemoryRouter>
  )
}

describe('Home -- PageHeader component', () => {
  test('it should render correctly', () => {
    expect(shallow(<PageHeader />)).toMatchSnapshot()
  })

  test('+ Create New Project button be visible if role is Coordinator', () => {
    let wrapper = setup({ role: 'Coordinator' })
    expect(wrapper.find(Button)).toHaveLength(1)
  })

  test('+ Create New Project button should not be visible if role is Coder', () => {
    let wrapper = setup({ role: 'Coder' })
    expect(wrapper.find(Button)).toHaveLength(0)
  })
})