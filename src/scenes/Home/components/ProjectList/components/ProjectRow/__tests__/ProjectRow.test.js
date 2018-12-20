import React from 'react'
import { shallow, mount } from 'enzyme'
import { ProjectRow } from '../../ProjectRow/index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import theme from 'services/theme'

const props = {
  project: { id: 1, name: 'Project 1', dateLastEdited: new Date('10/10/2012'), lastEditedBy: 'Kristin' },
  bookmarked: false,
  role: 'Coordinator',
  actions: {
    toggleBookmark: () => {},
    onExport: () => {}
  },
  theme: {
    palette: {
      greyText: '#757575'
    }
  }
}

const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <Table>
          <TableBody>
            <ProjectRow {...props} {...otherProps} />
          </TableBody>
        </Table>
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('Home scene - ProjectList - ProjectRow component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectRow {...props} />)).toMatchSnapshot()
  })

  describe('bookmark icon', () => {
    test('should be `bookmark` if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('tr').find('td').at(0)
      expect(wrapper.text()).toContain('bookmark')
    })

    test('should be `bookmark_border` if the project is not bookmarked', () => {
      const wrapper = setup().find('tr').find('td').at(0)
      expect(wrapper.text()).toContain('bookmark_border')
    })

    test('should be grey if the project is not bookmarked', () => {
      const wrapper = setup().find('tr').find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#757575')
    })

    test('should be orange if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('tr').at(0).find('td').at(0).find('Icon').at(0)
      expect(wrapper.prop('color')).toEqual('#fdc43b')
    })
  })

  test('should call actions.toggleBookmark', () => {
    const spy = jest.spyOn(props.actions, 'toggleBookmark')
    let wrapper = setup()
    wrapper.find('tr').find('td').at(0).find('Tooltip').at(0).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })

  xtest('should call onExport', () => {
    const spy = jest.spyOn(props.actions, 'onExport')
    let wrapper = setup()
    wrapper.find('tr').find('td').at(9).find('Tooltip').at(0).find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
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