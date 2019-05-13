import React from 'react'
import { shallow } from 'enzyme'
import { Protocol } from '../index'

const props = {
  projectName: 'Test Project',
  projectId: '12345',
  protocolContent: 'this is the text of the protocol',
  getProtocolError: false,
  submitting: false,
  lockedByCurrentUser: false,
  lockInfo: {},
  lockedAlert: false,
  hasLock: false,
  alertError: '',
  actions: {
    getProtocolRequest: () => {}
  },
  currentUser : { role:'Admin' }
}

describe('Protocol scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Protocol {...props} />)).toMatchSnapshot()
  })
})