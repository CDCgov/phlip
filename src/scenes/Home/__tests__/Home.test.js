import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from 'services/theme'
import { Home } from '../index'
import { ProjectList } from '../components/ProjectList'

const props = {
  actions: {
    getProjectsRequest: jest.fn(),
    sortProjects: jest.fn(),
    updatePage: jest.fn(),
    updateRows: jest.fn(),
    toggleBookmark: jest.fn(),
    sortBookmarked: jest.fn(),
    updateSearchValue: jest.fn(),
    setProjectToExport: jest.fn(),
    clearProjectToExport: jest.fn(),
    exportDataRequest: jest.fn()
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
  projects: [],
  visibleProjects: [],
  bookmarkList: [],
  sortBookmarked: false,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  page: 0,
  rowsPerPage: '10',
  searchValue: '',
  projectToExport: { text: '' },
  apiErrorAlert: {
    text: '',
    open: false
  }
}

// const setup = (otherProps = {}, initialEntries = ['/']) => {
//   return mount(<MemoryRouter initialEntries={initialEntries}>
//     <MuiThemeProvider theme={theme}>
//       <Home {...props} {...otherProps} />
//     </MuiThemeProvider>
//   </MemoryRouter>)
// }

const setup = (otherProps = {}) => {
  return shallow(<Home {...props} {...otherProps} />)
}

describe('Home scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Home {...props} />)).toMatchSnapshot()
  })
  
  test('should render ProjectList and PageHeader components', () => {
    const wrapper = setup()
    expect(wrapper.find('withRouter(ProjectList)')).toHaveLength(1)
  })
  
  describe('Error handling', () => {
    test('should display an error message if prop: error is true', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError')).toHaveLength(1)
      expect(wrapper.find('withRouter(ProjectList)')).toHaveLength(0)
    })
    
    test('should display the content of errorContent prop in error message', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError').childAt(0).text()).toEqual('Uh-oh! Something went wrong. We could not get projects.')
    })
  })
})
