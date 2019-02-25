import React from 'react'
import { shallow } from 'enzyme'
import { ConfirmDocList } from '../index'

const props = {
  documents: [{ name: 'Doc', _id: '1' }], docCount:1
}

describe('DocumentManagement - DocList', () => {
  test('should render correctly', () => {
    expect(shallow(<ConfirmDocList {...props} />)).toMatchSnapshot()
  })
})