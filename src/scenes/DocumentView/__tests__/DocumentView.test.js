import React from 'react'
import { shallow, mount } from 'enzyme'
import { DocumentView } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import theme from 'services/theme'

const props = {
  document: {
    content: {},
    name: 'Test file'
  },
  history: {},
  location: {
    state: {
      document: { _id: 1234 }
    }
  },
  documentRequestInProgress: false,
  actions: {
    getDocumentContentsRequest: jest.fn(),
    initState: jest.fn()
  }
}

const setup = (otherProps = {}) => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <DocumentView {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('DocumentView scene', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentView {...props} />)).toMatchSnapshot()
  })
})
