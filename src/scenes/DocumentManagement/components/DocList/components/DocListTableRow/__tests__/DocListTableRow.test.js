import React from 'react'
import { shallow } from 'enzyme'
import { DocListTableRow } from '../index'

const props = {
  doc: { name: 'doc1', uploadedBy: { firstName: 'Test', lastName: 'User' }, uploadedDate: '1/1/2000' },
  onSelectFile: () => {},
  isChecked: false
}

describe('DocumentManagement - DocList - DocListTableRow', () => {
  test('should render correctly', () => {
    expect(shallow(<DocListTableRow {...props} />)).toMatchSnapshot()
  })
})