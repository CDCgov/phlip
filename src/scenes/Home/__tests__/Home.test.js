import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'
import { Home } from '../'
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
    sortBookmarked: jest.fn()
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
  rowsPerPage: 10
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
})
