import React from 'react'
import { shallow } from 'enzyme'
import { ExportDialog } from '../index'

const props = {
  onClose: jest.fn(),
  onChooseExport: jest.fn(),
  open: true,
  projectToExport: {
    id: 1,
    text: '',
    user: { id: null, firstName: '', lastName: '' },
    exportType: null
  },
  inProgress: false
}

describe('Home - Export Dialog', () => {
  test('should render correctly', () => {
    expect(shallow(<ExportDialog {...props} />)).toMatchSnapshot()
  })
})
