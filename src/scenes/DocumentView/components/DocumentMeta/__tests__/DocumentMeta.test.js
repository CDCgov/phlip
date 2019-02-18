import React from 'react'
import { shallow } from 'enzyme'
import { DocumentMeta } from '../index'

const props = {
  document: {
    content: {},
    name: 'Test file',
    uploadedByName: 'Trung',
    projects: [1, 2],
    jurisdictions: [25332, 2932],
    uploadedDate: new Date('2/11/2019')
  },
  effectiveDate: new Date('2/11/2019'),
  projectList: ['Project1', 'Project2'],
  jurisdictionList: ['Georgia', 'Alabama'],
  loading: false,
  jurisdictionSuggestions: [
    { id: 2932 }, { id: 25332 },
    { id: 1 }, { id: 2 }, { id: 3 }
  ],
  projectSuggestions: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }],
  apiErrorInfo: { title: '', text: '' },
  apiErrorOpen: false
}

describe('DocumentView - DocumentMeta', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentMeta {...props} />)).toMatchSnapshot()
  })
})