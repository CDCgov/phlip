import React from 'react'
import { shallow } from 'enzyme'
import { DocListTableRow } from '../index'

const props = {
  doc: { name: 'doc1', uploadedBy: { firstName: 'Test', lastName: 'User' }, uploadedDate: '1/1/2000' },
  onSelectFile: () => {},
  isChecked: false
}


