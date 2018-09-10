import React from 'react'
import { shallow } from 'enzyme'
import ProjectTableHead from '../index'
import { MuiThemeProvider } from '@material-ui/core/styles'

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
    let wrapper = shallow(<ProjectTableHead {...props} />)
    wrapper.find('TableCell').at(0).childAt(0).simulate('click')
    wrapper.update()
    expect(props.onSortBookmarked).toHaveBeenCalled()
  })

  describe('Sorting', () => {
    test('should call onRequestSort with name when the Name header is clicked', () => {
      let wrapper = shallow(<ProjectTableHead {...props} />)
      wrapper.find('TableCell').at(1).childAt(0).childAt(0).simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('name')
    })

    test('should call onRequestSort with dateLastEdited when the Date Last Edited header is clicked', () => {
      let wrapper = shallow(<ProjectTableHead {...props} />)
      wrapper.find('TableCell').at(2).childAt(0).childAt(0).simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('dateLastEdited')
    })

    test('should call onRequestSort with lastEditedBy when the Last Edited By header is clicked', () => {
      let wrapper = shallow(<ProjectTableHead {...props} />)
      wrapper.find('TableCell').at(3).childAt(0).childAt(0).simulate('click')
      wrapper.update()
      expect(props.onRequestSort).toHaveBeenCalledWith('lastEditedBy')
    })
  })
})