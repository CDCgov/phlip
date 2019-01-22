import React from 'react'
import { shallow } from 'enzyme'
import { DocumentManagement } from '../index'

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
  },
  apiErrorOpen: false,
  apiErrorInfo: {
        title: '',
        text: ''
    },
}

describe('Document Management scene', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentManagement {...props} />)).toMatchSnapshot()
  })
})