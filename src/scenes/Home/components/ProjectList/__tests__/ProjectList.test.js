import React from 'react'
import { shallow, mount } from 'enzyme'
import { ProjectList } from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from 'services/theme'

let date = new Date('10/11/2017')

const props = {
  projects: [
    { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: date, lastEditedBy: 'Kristin' },
    { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: date, lastEditedBy: 'Michael' }
  ],
  user: {
    id: 2,
    firstName: 'Kristin',
    lastName: 'Muterspaw',
    email: 'kmusterspaw@cdc.gov',
    password: 'test',
    role: 'Coordinator'
  },
  sortBy: 'name',
  direction: 'asc',
  page: 0,
  rowsPerPage: 10,
  count: 2,
  handleToggleBookmark: jest.fn(),
  handlePageChange: jest.fn(),
  handleRowsChange: jest.fn(),
  handleRequestSort: jest.fn(),
  handleExport: jest.fn(),
  handleSortBookmarked: jest.fn()
}

const setup = otherProps => {
  return mount((
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <ProjectList {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  ))
}

describe('Home scene - ProjectList component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectList {...props} />)).toMatchSnapshot()
  })

  test('should render ProjectTableBody and ProjectTableHead components', () => {
    let wrapper = shallow(<ProjectList {...props} />)
    expect(wrapper.find('ProjectTableHead')).toHaveLength(1)
    expect(wrapper.find('ProjectTableBody')).toHaveLength(1)
  })

  test('should hide coding scheme, validate columns if role is Coder', () => {
    let wrapper = setup({ user: { role: 'Coder' } }).find('TableRow').at(0).find('TableCell')
    wrapper.forEach(th => {
      expect(th.key()).not.toEqual('codingScheme')
      expect(th.key()).not.toEqual('validate')
      expect(th.key()).not.toEqual('jurisdictions')
    })
  })

  test('should show all columns if role is Coordinator', () => {
    let wrapper = setup({ user: { role: 'Coordinator' } })
    wrapper = wrapper.find('TableBody').find('tr').at(0).find('td')
    expect(wrapper.length).toEqual(10)
  })

  describe('bookmark icon', () => {
    test('should be `bookmark` if the project is bookmarked', () => {
      let wrapper = setup().find('TableBody').find('tr').at(0).find('td').at(0)
      expect(wrapper.text()).toEqual('bookmark')
    })

    test('should be `bookmark_border` if the project is not bookmarked', () => {
      let wrapper = setup().find('TableBody').find('tr').at(1).find('td').at(0)
      expect(wrapper.text()).toEqual('bookmark_border')
    })

    test('should be grey if the project is not bookmarked', () => {
      let wrapper = setup().find('TableBody').find('tr').at(1).find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#d4d4d4')
    })

    test('should be orange if the project is bookmarked', () => {
      let wrapper = setup().find('TableBody').find('tr').at(0).find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#fdc43b')
    })
  })

  test('should call onToggleBookmark', () => {
    let wrapper = setup()
    wrapper.find('ProjectTableBody').find('tr').at(0).find('td').at(0).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('ProjectTableBody').prop('onToggleBookmark')).toHaveBeenCalledWith(props.projects[0])
  })

  test('should call onExport', () => {
    let wrapper = setup()
    wrapper.find('ProjectTableBody').find('tr').at(0).find('td').at(9).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('ProjectTableBody').prop('onExport')).toHaveBeenCalled()
  })
})
