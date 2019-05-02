import React from 'react'
import { shallow } from 'enzyme'
import { ProjectPanel } from '../index'
import theme from 'services/theme'

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

/*const setup = otherProps => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <ProjectPanel {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}*/

describe('Home - ProjectList - ProjectPanel scene', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectPanel {...props} />)).toMatchSnapshot()
  })
  
  test('should render correctly when expanded', () => {
    expect(shallow(<ProjectPanel {...props} expanded />)).toMatchSnapshot()
  })
  
  xdescribe('when a coder is logged in', () => {
    describe('when the card is closed', () => {
      test('validate button should not be visible', () => {
    
      })
  
      test('code button should be visible', () => {
    
      })
    })
    
    describe('when the card is open', () => {
      test('validate button should not be visible', () => {
    
      })
  
      test('code button should be visible', () => {
    
      })
      
      test('coding scheme button should not be visible', () => {
      
      })
    })
  })
  
  xtest('should call props.onExport when the Export button is clicked', () => {
    //const spy = jest.spyOn(props, 'onExport')
    //const wrapper = setup({ expanded: true }).find('Icon')
    //wrapper.find('tr').find('td').at(9).find('Tooltip').at(0).find('IconButton').at(0).simulate('click')
    //wrapper.update()
    //expect(spy).toHaveBeenCalled()
  })
})
