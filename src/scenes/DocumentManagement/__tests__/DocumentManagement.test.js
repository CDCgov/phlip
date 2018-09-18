import React from 'react'
import { shallow, mount } from 'enzyme'
import { DocumentManagement } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import theme from 'services/theme'

const props = {
  page: 0,
  rowsPerPage: '10',
  documents: [],
  allSelected: false,
  docCount: 0,
  actions: {
    getDocumentsRequest: jest.fn(),
    handleSelectAll: jest.fn(),
    handleSearchFieldChange: jest.fn(),
    handlePageChange: jest.fn(),
    handleRowsChange: jest.fn(),
    handleSelectOneFile: jest.fn()
  }
}

const setup = (otherProps = {}) => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <DocumentManagement {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('Document Management scene', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentManagement {...props} />)).toMatchSnapshot()
  })
})