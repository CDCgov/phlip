import React from 'react'
import { shallow } from 'enzyme'
import { QuestionNode } from '../index'

const props = {
  listIndex: 0,
  node: {
    text: 'la la la',
    hovering: false
  },
  lowerSiblingCounts: [0],
  path: [0],
  scaffoldBlockPxWidth: 50,
  treeIndex: 0,
  isDragging: false,
  isOver: false,
  didDrop: false,
  canModify: true,
  canDrag: true,
  connectDragPreview: preview => preview,
  connectDragSource: handle => handle
}

describe('CodingScheme -- Scheme -- QuestionNode', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionNode {...props} />)).toMatchSnapshot()
  })
  
  describe('Question hovering', () => {
    test('should call setHoveredStatus on mouse enter', () => {
      const wrapper = shallow(<QuestionNode {...props} />)
      const card = wrapper.find('WithStyles(CardContent)').dive()
      const spy = jest.spyOn(wrapper.instance(), 'setHoveredStatus')
      card.find('CardContent').simulate('mouseenter')
      card.update()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should call turnOffHover on mouse leave', () => {
      const wrapper = shallow(<QuestionNode {...props} />)
      const card = wrapper.find('WithStyles(CardContent)').dive()
      const spy = jest.spyOn(wrapper.instance(), 'setHoveredStatus')
      card.find('CardContent').simulate('mouseleave')
      card.update()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should display actions if hovering = true and canModify = true', () => {
      const wrapper = shallow(<QuestionNode {...props} node={{ text: 'la la la' }} canModify={true} />)
      
      wrapper.setState({
        hovered: true
      })
      const card = wrapper.find('WithStyles(CardContent)').dive()
      expect(card.find('CardContent').find('WithTheme(Button)')).toHaveLength(3)
    })
    
    describe('hovering without edit mode enabled', () => {
      test('should only display one action button', () => {
        const wrapper = shallow(<QuestionNode {...props} node={{ text: 'la la la' }} canModify={false} />)
        wrapper.setState({
          hovered: true
        })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('CardContent').find('WithTheme(Button)')).toHaveLength(1)
      })
  
      test('should display an eyeball icon in button', () => {
        const wrapper = shallow(<QuestionNode {...props} node={{ text: 'la la la' }} canModify={false} />)
        wrapper.setState({
          hovered: true
        })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('WithTheme(Button)').prop('value').props.children).toEqual('visibility')
      })
      
      test('should set tooltip text for button icon to be View Question', () => {
        const wrapper = shallow(<QuestionNode {...props} node={{ text: 'la la la' }} canModify={false} />)
        wrapper.setState({
          hovered: true
        })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('WithStyles(Tooltip)').prop('text')).toEqual('View Question')
      })
    })
  })
})
