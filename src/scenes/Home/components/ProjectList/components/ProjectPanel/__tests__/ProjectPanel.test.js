import React from 'react'
import { mount, shallow } from 'enzyme'
import { ProjectPanel } from '../index'
import theme from 'services/theme'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'

const props = {
  actions: {
    getProjectUsers: jest.fn(),
    toggleBookmark: jest.fn()
  },
  onExport: jest.fn(),
  length: 4,
  id: 1,
  index: 0,
  project: {
    createdBy: 'Admin',
    createdByEmail: 'admin@cdc.gov',
    createdById: 1,
    dateCreated: '2019-04-08T11:43:46.3034169',
    dateLastEdited: '2019-04-18T13:27:51.454041',
    id: 2,
    lastEditedBy: 'Aleksandra Zaryanova',
    lastUsersCheck: 1555606985567,
    name: 'PROJECT',
    projectUsers: [],
    projectJurisdictions: [],
    type: 1
  },
  handleExpandProject: jest.fn(),
  bookmarked: false,
  expanded: false,
  allUsers: {},
  role: 'Admin',
  users: [],
  theme
}

const setup = otherProps => {
  return mount(<MemoryRouter>
    <MuiThemeProvider theme={theme}>
      <ProjectPanel {...props} {...otherProps} />
    </MuiThemeProvider>
  </MemoryRouter>)
}

describe('Home - ProjectList - ProjectPanel scene', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectPanel {...props} />)).toMatchSnapshot()
  })

  describe('bookmark icon', () => {
    test('should be `bookmark` if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('IconButton').at(0)
      expect(wrapper.text()).toContain('bookmark')
    })

    test('should be `bookmark_border` if the project is not bookmarked', () => {
      const wrapper = setup().find('IconButton').at(0)
      expect(wrapper.text()).toContain('bookmark_border')
    })

    test('should be grey if the project is not bookmarked', () => {
      const wrapper = setup().find('IconButton').at(0)
      expect(wrapper.prop('color')).toEqual('#757575')
    })

    test('should be orange if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('IconButton').at('0')
      expect(wrapper.prop('color')).toEqual('#fdc43b')
    })
  })

  test('should call actions.toggleBookmark when the bookmark icon is clicked', () => {
    const spy = jest.spyOn(props.actions, 'toggleBookmark')
    let wrapper = setup()
    wrapper.find('IconButton').at(0).simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })

  // xtest('should call props.onExport when the Export button is clicked', () => {
  //   const spy = jest.spyOn(props, 'onExport')
  //   const wrapper = setup()
  //   wrapper.find('tr').find('td').at(9).find('Tooltip').at(0).find('IconButton').at(0).simulate('click')
  //   wrapper.update()
  //   expect(spy).toHaveBeenCalled()
  // })
  //
  // xtest('should hide coding scheme, validate columns if role is Coder', () => {
  //   let wrapper = setup({ role: 'Coder' }).find('tr').find('TableCell')
  //   wrapper.forEach(th => {
  //     expect(th.key()).not.toEqual('codingScheme')
  //     expect(th.key()).not.toEqual('validate')
  //     expect(th.key()).not.toEqual('jurisdictions')
  //   })
  // })
  //
  // xtest('should show all columns if role is Coordinator', () => {
  //   let wrapper = setup({ user: { role: 'Coordinator' } })
  //   wrapper = wrapper.find('tr').find('td')
  //   expect(wrapper.length).toEqual(10)
  // })
})
