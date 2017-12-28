import React from 'react'
import { shallow, mount } from 'enzyme'
import { ProjectRow } from '../../ProjectRow/index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'
import Table, { TableBody } from 'material-ui/Table'
import theme from 'services/theme'

let date = new Date('10/11/2017')

const props = {
  project: { id: 1, name: 'Project 1', dateLastEdited: date, lastEditedBy: 'Kristin' },
  bookmarked: false,
  role: 'Coordinator',
  actions: {
    toggleBookmark: jest.fn(),
    onExport: jest.fn()
  }
}

const setup = otherProps => {
  return mount((
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <Table>
          <TableBody>
            <ProjectRow {...props} {...otherProps} />
          </TableBody>
        </Table>
      </MuiThemeProvider>
    </MemoryRouter>
  ))
}

describe('Home scene - ProjectList - ProjectRow component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectRow {...props} />)).toMatchSnapshot()
  })

  describe('bookmark icon', () => {
    test('should be `bookmark` if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('tr').find('td').at(0)
      expect(wrapper.text()).toEqual('bookmark')
    })

    test('should be `bookmark_border` if the project is not bookmarked', () => {
      const wrapper = setup().find('tr').find('td').at(0)
      expect(wrapper.text()).toEqual('bookmark_border')
    })

    test('should be grey if the project is not bookmarked', () => {
      const wrapper = setup().find('tr').find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#d4d4d4')
    })

    test('should be orange if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('tr').at(0).find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#fdc43b')
    })
  })

  xtest('should call onToggleBookmark', () => {
    let wrapper = setup()
    wrapper.find('tr').find('td').at(0).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('ProjectRow').prop('actions.toggleBookmark')).toHaveBeenCalled()
  })

  xtest('should call onExport', () => {
    let wrapper = setup()
    wrapper.find('tr').find('td').at(9).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('ProjectRow').prop('actions.onExport')).toHaveBeenCalled()
  })

  test('should hide coding scheme, validate columns if role is Coder', () => {
    let wrapper = setup({ role: 'Coder' }).find('tr').find('TableCell')
    wrapper.forEach(th => {
      expect(th.key()).not.toEqual('codingScheme')
      expect(th.key()).not.toEqual('validate')
      expect(th.key()).not.toEqual('jurisdictions')
    })
  })

  test('should show all columns if role is Coordinator', () => {
    let wrapper = setup({ user: { role: 'Coordinator' } })
    wrapper = wrapper.find('tr').find('td')
    expect(wrapper.length).toEqual(10)
  })
})