import React from 'react'
import { shallow } from 'enzyme'
import { QuestionRow } from '../index'

const props = {
  item: { ancestorSiblings: [] },
  treeLength: 0,
  onQuestionSelected: () => {}
}

describe('Coding scene - QuestionRow', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionRow {...props} />)).toMatchSnapshot()
  })
})
