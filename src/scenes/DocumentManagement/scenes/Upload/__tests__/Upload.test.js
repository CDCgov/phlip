import React from 'react'
import { shallow, mount } from 'enzyme'
import { Upload } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import theme from 'services/theme'

const props = {
  selectedDocs: [],
  uploadError: null,
  uploadedDocs: [],
  uploading: false,
  user: { firstName: 'test', lastName: 'user' },
  isReduxForm: false,
  actions: {
    uploadDocumentsRequest: jest.fn(),
    updateDocumentProperty: jest.fn(),
    addSelectedDocs: jest.fn(),
    clearSelectedFiles: jest.fn(),
    removeDoc: jest.fn(),
    removeTag: jest.fn(),
    addTag: jest.fn()
  }
}

const setup = (otherProps = {}) => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <Upload {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('Document Management - Upload scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Upload {...props} />)).toMatchSnapshot()
  })
})