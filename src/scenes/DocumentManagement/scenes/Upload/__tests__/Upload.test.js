import React from 'react'
import { shallow, mount } from 'enzyme'
import { Upload } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from 'services/theme'

const props = {
  selectedDocs: [],
  uploadError: null,
  uploading: false,
  user: { firstName: 'test', lastName: 'user' },
  isReduxForm: false,
  actions: {},
  alertText: '',
  alertOpen: false,
  alertTitle: '',
  uploading: false
}

const actions = {
  uploadDocumentsRequest: () => {},
  updateDocumentProperty: () => {},
  addSelectedDocs: () => {},
  clearSelectedFiles: () => {},
  removeDoc: () => {},
  removeTag: () => {},
  addTag: () => {}
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

  test('should show an alert if uploading takes a long time', (done) => {
    const wrapper = shallow(<Upload {...props} />)
    wrapper.setProps({ uploading: true })
    setTimeout(() => {
      expect(wrapper.find('Alert')).toHaveLength(1)
      done()
    }, 1005)
  })
})