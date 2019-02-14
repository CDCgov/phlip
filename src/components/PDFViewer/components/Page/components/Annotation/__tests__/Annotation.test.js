import React from 'react'
import { mount } from 'enzyme'
import { Annotation } from '../index'
import { viewport, annotations, totalAnnotationLenth } from 'utils/testData/pdfTest'

const props = {
  annotation: annotations[0],
  index: 0,
  pageNumber: 1,
  pending: false,
  isClicked: false,
  handleConfirmAnnotation: jest.fn(),
  handleCancelAnnotation: jest.fn(),
  handleRemoveAnnotation: jest.fn(),
  handleClickAnnotation: jest.fn(),
  transform: viewport.transform
}

describe('PDFViewer - Page - Annotation components', () => {
  test('should render correctly', () => {
    const wrapper = mount(<Annotation {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should render all annotation rects', () => {
    const wrapper = mount(<Annotation {...props} />)
    console.log(wrapper.debug())
    //expect(annotationLayer.children()).toHaveLength(totalAnnotationLenth)
  })
})