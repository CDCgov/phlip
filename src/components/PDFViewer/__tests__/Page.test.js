import React from 'react'
import { mount } from 'enzyme'
import { Page } from '../Page'

const props = {
  page: {
    getViewport: () => ({ width: 100, height: 100 })
  },
  pendingAnnotations: [],
  annotations: [],
  textContent: {
    items: []
  },
  saveAnnotation: jest.fn(),
  cancelAnnotation: jest.fn(),
  allowSelection: false,
  id: 0,
  viewerDimensions: {
    height: 0,
    width: 0
  }
}

describe('PDFViewer - Page component', () => {
  test('should render correctly', () => {
    const wrapper = mount(<Page {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})