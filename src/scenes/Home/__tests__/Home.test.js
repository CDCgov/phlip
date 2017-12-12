import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'
import { Home } from '../index'
import { PageHeader } from '../components/PageHeader'
import { ProjectList } from '../components/ProjectList'
import { mockProjects } from 'data/mockProjects'

const props = {
  actions: {
    getProjectsRequest: jest.fn(),
    sortProjects: jest.fn(),
    updatePage: jest.fn(),
    updateRows: jest.fn(),
    toggleBookmark: jest.fn(),
    sortBookmarked: jest.fn(),
    updateSearchValue: jest.fn(),
  },
  user: {
    id: 2,
    firstName: 'Kristin',
    lastName: 'Muterspaw',
    email: 'kmuterspaw@cdc.gov',
    password: 'test',
    role: 'Coordinator'
  },
  error: false,
  errorContent: '',
  projects: mockProjects,
  visibleProjects: [],
  sortBookmarked: false,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  page: 0,
  rowsPerPage: 10,
  searchValue: ''
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <Home {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('Home scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Home {...props} />)).toMatchSnapshot()
  })

  test('should render ProjectList and PageHeader components', () => {
    let wrapper = shallow(<Home {...props} />)
    expect(wrapper.find(ProjectList)).toHaveLength(1)
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })

  test('should open the New Project modal when Create New Project is clicked', () => {
    let wrapper = setup()
    wrapper.find(PageHeader).find('Button').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('Modal')).toHaveLength(1)
  })

  describe('Error handling', () => {
    test('should display an error message if prop: error is true', () => {
      let wrapper = shallow(<Home {...props} />)
      expect(wrapper.find('ProjectList')).toHaveLength(1)
      wrapper.setProps({ error: true, errorContent: 'We could not get list of projects.' })
      expect(wrapper.find('CardError')).toHaveLength(1)
      expect(wrapper.find('ProjectList')).toHaveLength(0)
    })

    test('should display the content of errorContent prop in error message', () => {
      let wrapper = shallow(<Home {...props } error={true} errorContent="We could not get projects." />)
      expect(wrapper.find('CardError').render().text()).toContain('Uh-oh, something went wrong. We could not get projects.')
    })
  })
})
