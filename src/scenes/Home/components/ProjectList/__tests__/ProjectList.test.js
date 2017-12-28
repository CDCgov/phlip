import React from 'react'
import { shallow, mount } from 'enzyme'
import { ProjectList } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'

const props = {
  projectIds: [
    1, 2
  ],
  user: {
    id: 2,
    firstName: 'Kristin',
    lastName: 'Muterspaw',
    email: 'kmusterspaw@cdc.gov',
    password: 'test',
    role: 'Coordinator'
  },
  bookmarkList: [1],
  sortBy: 'name',
  direction: 'asc',
  page: 0,
  rowsPerPage: 10,
  count: 2,
  handleToggleBookmark: jest.fn(),
  handlePageChange: jest.fn(),
  handleRowsChange: jest.fn(),
  handleRequestSort: jest.fn(),
  handleExport: jest.fn(),
  handleSortBookmarked: jest.fn()
}

describe('Home scene - ProjectList component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectList {...props} />)).toMatchSnapshot()
  })
})
