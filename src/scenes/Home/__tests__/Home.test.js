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
    updateSearchValue: jest.fn()
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
  exportError: ''
}

const setup = (otherProps = {}, initialEntries = ['/']) => {
  return mount(<MemoryRouter initialEntries={initialEntries}>
    <MuiThemeProvider theme={theme}>
      <Home {...props} {...otherProps} />
    </MuiThemeProvider>
  </MemoryRouter>)
}

describe('Home scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Home {...props} />)).toMatchSnapshot()
  })
  
  test('should render ProjectList and PageHeader components', () => {
    const wrapper = setup()
    expect(wrapper.find(ProjectList)).toHaveLength(1)
  })
  
  describe('Error handling', () => {
    test('should display an error message if prop: error is true', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError')).toHaveLength(1)
      expect(wrapper.find('ProjectList')).toHaveLength(0)
    })
    
    test('should display the content of errorContent prop in error message', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError').text()).toEqual('Uh-oh! Something went wrong. We could not get projects.')
    })
  })
})

// import { shallow } from 'enzyme'
// import { ProjectTableHead } from '../index'
//
// const props = {
//   role: 'Coordinator',
//   sortBy: 'dateLastEdited',
//   direction: 'desc',
//   sortBookmarked: false,
//   onRequestSort: jest.fn(),
//   onSortBookmarked: jest.fn()
// }
//
// describe('Home scene - ProjectList - ProjectTableHead component', () => {
//   test('should render correctly', () => {
//     expect(shallow(<ProjectTableHead {...props} />)).toMatchSnapshot()
//   })
//
//   test('should call onSortBookmarked when bookmarked icon in header is clicked', () => {
//     const wrapper = shallow(<ProjectTableHead {...props} />).dive().dive()
//     wrapper.find('IconButton').at(0).simulate('click')
//     wrapper.update()
//     expect(props.onSortBookmarked).toHaveBeenCalled()
//   })
//
//   describe('Sorting', () => {
//     test('should call onRequestSort with name when the Name header is clicked', () => {
//       const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-name').childAt(0).dive()
//       wrapper.simulate('click')
//       wrapper.update()
//       expect(props.onRequestSort).toHaveBeenCalledWith('name')
//     })
//
//     test('should call onRequestSort with dateLastEdited when the Date Last Edited header is clicked', () => {
//       const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-dateLastEdited').childAt(0).dive()
//       wrapper.simulate('click')
//       wrapper.update()
//       expect(props.onRequestSort).toHaveBeenCalledWith('dateLastEdited')
//     })
//
//     test('should call onRequestSort with lastEditedBy when the Last Edited By header is clicked', () => {
//       const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-lastEditedBy').childAt(0).dive()
//       wrapper.simulate('click')
//       wrapper.update()
//       expect(props.onRequestSort).toHaveBeenCalledWith('lastEditedBy')
//     })
//   })
// })
