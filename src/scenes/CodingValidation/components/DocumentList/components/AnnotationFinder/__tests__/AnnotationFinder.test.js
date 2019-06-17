import React from 'react'
import { AnnotationFinder } from '../index'
import { shallow } from 'enzyme'

const props = {
  count: 4,
  current: 0,
  users: [],
  handleNext: jest.fn(),
  handlePrevious: jest.fn()
}

describe('PDFViewer - AnnotationFinder', () => {
  test('should render correctly', () => {
    expect(shallow(<AnnotationFinder {...props} />)).toMatchSnapshot()
  })
})
