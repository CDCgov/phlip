import React from 'react'
import { shallow } from 'enzyme'
import { ProjectTableHead } from '../index'

const props = {
  role: 'Coordinator',
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  onRequestSort: jest.fn(),
  onSortBookmarked: jest.fn()
}

describe('Home scene - ProjectList - ProjectTableHead component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectTableHead {...props} />)).toMatchSnapshot()
  })

  test('should call onSortBookmarked when bookmarked icon in header is clicked', () => {
    const wrapper = shallow(<ProjectTableHead {...props} />).dive().dive()
    wrapper.find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(props.onSortBookmarked).toHaveBeenCalled()
  })

  describe('Sorting', () => {
    test('should call onRequestSort with name when the Name header is clicked', () => {
      const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-name').childAt(0).dive()
      wrapper.simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('name')
    })

    test('should call onRequestSort with dateLastEdited when the Date Last Edited header is clicked', () => {
      const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-dateLastEdited').childAt(0).dive()
      wrapper.simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('dateLastEdited')
    })

    test('should call onRequestSort with lastEditedBy when the Last Edited By header is clicked', () => {
      const wrapper = shallow(<ProjectTableHead {...props} />).find('#sort-by-lastEditedBy').childAt(0).dive()
      wrapper.simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('lastEditedBy')
    })
  })
})