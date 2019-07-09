import React from 'react'
import { shallow } from 'enzyme'
import { CodingScheme } from '../index'

const props = {
  actions: {
    getSchemeRequest: () => {},
    toggleHover: () => {},
    updateQuestionTree: () => {},
    enableHover: () => {},
    disableHover: () => {}
  },
  questions: [],
  lockInfo: {},
  lockedByCurrentUser: false,
  hasLock: false,
  currentUser : { role:'Admin' },
  copying: false,
  projectAutocompleteProps: {
    selectedSuggestion: {}
  }
}

describe('CodingScheme scene', () => {
  test('should render correctly', () => {
    expect(shallow(<CodingScheme {...props} />)).toMatchSnapshot()
  })
})
