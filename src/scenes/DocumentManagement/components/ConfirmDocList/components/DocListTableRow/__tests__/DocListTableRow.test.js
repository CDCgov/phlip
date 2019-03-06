import React from 'react'
import { shallow } from 'enzyme'
import { DocListTableRow } from '../index'

const props = {
  doc: {
    name: 'doc1',
    uploadedBy: { firstName: 'Test', lastName: 'User' },
    uploadedDate: new Date('1/1/2000').toLocaleDateString(),
    projects: ['Project 1', 'Project 2'],
    jurisdictions: ['Ohio (state)', 'Georgia (state)']
  },
  projectList: ['P1', 'P2'],
  jurisdictionList: ['J1', 'J2'],
  onSelectFile: () => {},
  isChecked: false
}

describe('DocumentManagement - DocList - DocListTableRow', () => {
  test('should render correctly', () => {
    expect(shallow(<DocListTableRow {...props} />)).toMatchSnapshot()
  })
})