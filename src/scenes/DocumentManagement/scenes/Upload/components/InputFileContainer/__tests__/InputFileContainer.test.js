import React from 'react'
import { shallow } from 'enzyme'
import { InputFileContainer } from '../index'

const props = {
  handleInitiateFileSelecter: () => {},
  handleAddFilesToList: () => {},
  inputRef: {}
}

describe('Document Management - Upload - InputFileContainer', () => {
  test('should render correctly', () => {
    expect(shallow(<InputFileContainer {...props} />)).toMatchSnapshot()
  })
})