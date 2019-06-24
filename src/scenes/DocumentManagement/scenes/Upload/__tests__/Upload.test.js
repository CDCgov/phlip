import React from 'react'
import { shallow } from 'enzyme'
import { Upload } from '../index'

const props = {
  selectedDocs: [],
  uploadError: null,
  uploading: false,
  user: { firstName: 'test', lastName: 'user' },
  isReduxForm: false,
  actions: {},
  alert: {
    open: false,
    text: '',
    type: 'basic',
    title: ''
  },
  uploadProgress: {
    index: 0,
    total: 0,
    failures: false
  },
  infoRequestInProgress: false
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
