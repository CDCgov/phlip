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

describe('Admin scene - PageHeader component', () => {
  test('should render correctly', () => {
    expect(shallow(<PageHeader />)).toMatchSnapshot()
  })
})