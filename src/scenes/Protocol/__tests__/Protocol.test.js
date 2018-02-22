import React from 'react'
import { shallow, mount } from 'enzyme'
import { Protocol } from '../index'

const props = {
  actions: {
    getProtocolRequest: () => {},
    saveProtocolRequest: () => {}
  },
  projectId: 1,
  protocolContent: 'protocol!!!',
  projectName: 'Project Test'
}

xdescribe('Protocol scene', () => {
  test('should render correctly', () => {
    expect(mount(<Protocol {...props} />)).toMatchSnapshot()
  })
})
