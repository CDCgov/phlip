import React from 'react'
import { shallow } from 'enzyme'
import { ProjectPanel } from '../index'
import theme from 'services/theme'

const props = {
  actions: {
    getProjectUsers: jest.fn(),
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
  handleExportProject: jest.fn(),
  bookmarked: false,
  expanded: false,
  allUsers: {},
  role: 'Admin',
  users: [],
  theme
}

describe('Home - ProjectList - ProjectPanel scene', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectPanel {...props} />)).toMatchSnapshot()
  })
})
