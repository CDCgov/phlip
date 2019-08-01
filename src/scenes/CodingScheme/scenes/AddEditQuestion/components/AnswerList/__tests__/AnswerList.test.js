import React from 'react'
import { AnswerList } from '../index'
import { shallow } from 'enzyme'

const props = {
  fields: {
    map: jest.fn(),
    swap: jest.fn(),
    push: jest.fn(),
    remove: jest.fn()
  },
  answerType: 3,
  isEdit: false,
  canModify: true
}

describe('AddEditQuestion form -- AnswerList', () => {
  test('should render correctly', () => {
    expect(shallow(<AnswerList {...props} />)).toMatchSnapshot()
  })
})
