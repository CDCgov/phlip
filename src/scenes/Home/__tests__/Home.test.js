import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'
import { Home } from '../'
import { PageHeader } from '../components/PageHeader'
import { ProjectList } from '../components/ProjectList'

let date = new Date('10/11/2017')
const projects = [
  { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: date, lastEditedBy: 'Kristin Muterspaw' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: date, lastEditedBy: 'Michael Ta' },
  { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: date, lastEditedBy: 'Sanjith David' },
  { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: date, lastEditedBy: 'Greg Ledbetter' },
  { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: date, lastEditedBy: 'Jason James' },
  { id: 6, bookmarked: false, name: 'Project 6', dateLastEdited: date, lastEditedBy: 'Hez Adedoyin' }
]

const props = {
  actions: {
    getProjectsRequest: jest.fn(),
    sortProjects: jest.fn(),
    updatePage: jest.fn(),
    updateRows: jest.fn(),
    toggleBookmark: jest.fn()
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
  projects,
  visibleProjects: projects,
  sortBy: 'name',
  direction: 'asc',
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
  test('it should render correctly', () => {
    expect(shallow(<Home {...props} />)).toMatchSnapshot()
  })

  test('it should render ProjectList and PageHeader components', () => {
    let wrapper = shallow(<Home {...props} />)

    expect(wrapper.find(ProjectList)).toHaveLength(1)
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })

  test('it should open the New Project modal when Create New Project is clicked', () => {
    let wrapper = setup()
    wrapper.find(PageHeader).find('Button').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('Modal')).toHaveLength(1)
  })
})