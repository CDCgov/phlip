import React from 'react'
import { shallow } from 'enzyme'
import { PDFViewer } from '../index'

const props = {
  document: {
    content: {}
  },
  allowSelection: false,
  annotations: [],
  saveAnnotation: jest.fn()
}

describe('PDFViewer component', () => {
  test('should render correctly', () => {
    expect(shallow(<PDFViewer {...props} />)).toMatchSnapshot()
  })
})