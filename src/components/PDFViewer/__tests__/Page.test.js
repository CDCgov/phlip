import React from 'react'
import { mount } from 'enzyme'
import { Page } from '../Page'
import { viewport, textContent, annotations, totalAnnotationLenth } from 'utils/testData/pdfTest'

const props = {
  page: {
    getViewport: () => viewport
  },
  pendingAnnotations: [],
  annotations: [],
  textContent: { items: [] },
  saveAnnotation: jest.fn(),
  cancelAnnotation: jest.fn(),
  allowSelection: false,
  id: 0,
  viewerDimensions: {
    height: 760,
    width: 732
  }
}

describe('PDFViewer - Page component', () => {
  test('should render correctly', () => {
    const wrapper = mount(<Page {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should all text divs', () => {
    const wrapper = mount(
      <Page
        {...props}
        textContent={textContent}
      />
    )
    const length = textContent.items.length
    const textLayer = wrapper.find('#text-layer-page-0')
    expect(textLayer.children()).toHaveLength(length)
  })

  test('should render annotations', () => {
    const wrapper = mount(
      <Page
        {...props}
        textContent={textContent}
        annotations={annotations}
      />
    )

    const annotationLayer = wrapper.find('#page-0-annotations')
    expect(annotationLayer.children()).toHaveLength(totalAnnotationLenth)
  })
})