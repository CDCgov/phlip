import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { QuestionNode } from '../index'

const props = {
  listIndex: 0,
  node: {
    questionBody: 'la la la',
    hovering: false
  },
  lowerSiblingCounts: [0],
  path: [0],
  scaffoldBlockPxWidth: 50,
  treeIndex: 0,
  isDragging: false,
  isOver: false,
  didDrop: false,
  connectDragPreview: (preview) => preview,
  connectDragSource: (handle) => handle,
  turnOnHover: () => {},
  turnOffHover: () => {},
  enableHover: () => {},
  disableHover: () => {}
}

const setup = otherProps => mount((
  <MemoryRouter>
    <QuestionNode {...props} {...otherProps} />
  </MemoryRouter>
))

describe('CodingScheme -- Scheme -- QuestionNode', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionNode {...props} />)).toMatchSnapshot()
  })

  describe('Question hovering', () => {
    test('should call turnOnHover on mouse enter', () => {
      const spy = jest.spyOn(props, 'turnOnHover')
      const wrapper = setup()
      wrapper.find('CardContent').simulate('mouseenter')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should call turnOffHover on mouse leave', () => {
      const spy = jest.spyOn(props, 'turnOffHover')
      const wrapper = setup()
      wrapper.find('CardContent').simulate('mouseleave')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should display actions if hovering = true', () => {
      const wrapper = setup({ node: { questionBody: 'la la la', hovering: true } })
      expect(wrapper.find('CardContent').find('button')).toHaveLength(3)
    })

    test('should not display actions if hovering = false', () => {
      const wrapper = setup()
      expect(wrapper.find('CardContent').find('button')).toHaveLength(0)
    })
  })

  describe('Hovering disable', () => {
    test('should call disableHover when dragging starts', () => {
      const spy = jest.spyOn(props, 'disableHover')
      const wrapper = setup()
      wrapper.find('div').at(3).simulate('dragstart')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })

    test('should call enableHover when dragging stops', () => {
      const spy = jest.spyOn(props, 'enableHover')
      const wrapper = setup()
      wrapper.find('div').at(3).simulate('dragend')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})