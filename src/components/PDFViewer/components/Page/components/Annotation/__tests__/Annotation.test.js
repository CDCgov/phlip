import React from 'react'
import { mount } from 'enzyme'
import { Annotation } from '../index'
import { viewport, annotations } from 'utils/testData/pdfTest'

const props = {
  annotation: annotations[0],
  index: 0,
  pageNumber: 0,
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
    expect(wrapper.children()).toHaveLength(3)
  })

  describe('removing annotations', () => {
    test('should call handleClickAnnotation if an the first rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      wrapper.children().at(0).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should call handleClickAnnotation if an the last rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      wrapper.children().at(2).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should call handleClickAnnotation if an the any rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      wrapper.children().at(1).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should show x icon button if isClicked is true', () => {
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      expect(wrapper.find('.iconActions')).toHaveLength(1)
    })

    test('should not show x icon button if isClicked is false', () => {
      const wrapper = mount(<Annotation {...props} />)
      expect(wrapper.find('.iconActions')).toHaveLength(0)
    })

    test('should only show the x button and not the check', () => {
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      expect(wrapper.find('.iconActions').children()).toHaveLength(1)
    })

    test('should call handleRemoveAnnotation if icon x button is clicked', () => {
      const spy = jest.spyOn(props, 'handleRemoveAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked={true} />)
      wrapper.find('.iconActions').find('button').simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})