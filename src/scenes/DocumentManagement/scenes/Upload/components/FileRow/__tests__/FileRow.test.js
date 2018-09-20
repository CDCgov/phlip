import React from 'react'
import { shallow } from 'enzyme'
import { FileRow } from '../index'

const props = {
  name: 'filename',
  index: 1,
  tags: [],
  isDuplicate: false,
  onRemoveDoc: () => {},
  onRemoveTag: () => {},
  onAddTag: () => {},
  classes: {
    chipContainer: {},
    chip: {}
  }
}

describe('Document Management - Upload - FileRow', () => {
  test('should render correctly', () => {
    expect(shallow(<FileRow {...props} />)).toMatchSnapshot()
  })
})