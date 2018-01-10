import React from 'react'
import { shallow, mount } from 'enzyme'
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
  connectDragPreview: (preview) => preview,
  connectDragSource: (handle) => handle,
  didDrop: false,
  turnOnHover: () => {},
  turnOffHover: () => {},
  isDragging: false,
  isOver: false
}

const setup = otherProps => mount(<QuestionNode {...props} {...otherProps} />)

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
})