import React from 'react'
import { shallow } from 'enzyme'
import { AvatarList } from '../index'

const props = {
  answerList: [],
  userImages: {},
  selectedIndex: 0,
  handleClickAvatar: jest.fn()
}

describe('QuestionCard - QuestionContent - AvatarList', () => {
  test('should render correctly', () => {
    expect(shallow(<AvatarList {...props} />)).toMatchSnapshot()
  })
})
