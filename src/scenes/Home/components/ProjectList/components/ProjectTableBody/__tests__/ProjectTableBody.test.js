import React from 'react'
import { shallow } from 'enzyme'
import ProjectTableBody from '../index'

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
  onToggleBookmark: jest.fn(),
  onExport: jest.fn()
}

describe('Home scene - ProjectList - ProjectTableBody component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectTableBody {...props} />)).toMatchSnapshot()
  })
})