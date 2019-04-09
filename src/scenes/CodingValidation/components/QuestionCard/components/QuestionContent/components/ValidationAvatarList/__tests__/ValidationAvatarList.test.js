import React from 'react'
import { shallow } from 'enzyme'
import { ValidationAvatarList } from '../index'

const props = {
  answerList: [],
  userImages: {},
  selectedIndex: 0,
  handleClickAvatar: jest.fn()
}

describe('QuestionCard - QuestionContent - ValidationAvatarList', () => {
  test('should render correctly', () => {
    expect(shallow(<ValidationAvatarList {...props} />)).toMatchSnapshot()
  })
})
