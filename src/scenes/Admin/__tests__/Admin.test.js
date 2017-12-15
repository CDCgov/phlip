import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'
import { Admin } from '../'
import { UserList } from '../components/UserList'
import { PageHeader } from '../components/PageHeader'
import { mockUsers } from 'data/mockUsers'

const props = {
  users: mockUsers,
  actions: {
    getUsersRequest: jest.fn()
  },
  sortBy: 'name',
  direction: 'asc',
  page: 0,
  rowsPerPage: 10,
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <Admin {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('Admin Scene', () => {
  test('it should render correctly', () => {
    expect(shallow(<Admin {...props} />)).toMatchSnapshot()
  })

  test('should render UserList component', () => {
    let wrapper = shallow(<Admin {...props} />)
    expect(wrapper.find(UserList)).toHaveLength(1)
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })

  // test('should open the Add/Edit user modal when Add New User is clicked', () => {
  //   let wrapper = setup()
  //   wrapper.find(PageHeader).find('Button').at(0).simulate('click')
  //   wrapper.update()
  //   expect(wrapper.find('Modal')).toHaveLength(1)
  // })

})