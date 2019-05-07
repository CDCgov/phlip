import React from 'react'
import { ValidationAvatar } from '../index'
import { shallow } from 'enzyme'

describe('CodingValidation - QuestionCard - QuestionContent - ValidationAvatar compoent', () => {
  test('should render correctly', () => {
    expect(
      shallow(<ValidationAvatar user={{ username: 'Test User', initials: 'TU', avatar: '' }} />)
    ).toMatchSnapshot()
  })
})
