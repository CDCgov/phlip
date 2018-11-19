import React from 'react'
import { shallow, mount } from 'enzyme'
import { DocumentContents } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import theme from 'services/theme'

const props = {
  document: {
    content: {},
    name: 'Test file'
  },
  loading: false
}

const setup = (otherProps = {}) => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <DocumentContents {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('DocumentView - DocumentContents', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentContents {...props} />)).toMatchSnapshot()
  })
})