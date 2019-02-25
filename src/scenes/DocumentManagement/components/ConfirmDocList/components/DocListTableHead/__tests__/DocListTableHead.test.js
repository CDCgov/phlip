import React from 'react'
import { shallow } from 'enzyme'
import { DocListTableHead } from '../index'

const props = {
  onSelectAll: () => {},
  allSelected: false
}

describe('DocumentManagement - DocList - DocListTableHead', () => {
  test('should render correctly', () => {
    expect(shallow(<DocListTableHead {...props} />)).toMatchSnapshot()
  })
})