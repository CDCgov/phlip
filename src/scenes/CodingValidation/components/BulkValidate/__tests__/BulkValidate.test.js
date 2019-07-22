import React from 'react'
import { shallow } from 'enzyme'
import { BulkValidate } from '../index'

const props = {
  open: true,
  onConfirmValidate: jest.fn(),
  onClose: jest.fn(),
  users: [],
  validationInProgress: false
}

const setup = (otherProps = {}) => {
  return shallow(<BulkValidate {...props} {...otherProps} />)
}

describe('CodingValidation -- Bulk Validate modal', () => {
  test('should render correctly', () => {
    expect(setup()).toMatchSnapshot()
  })
})
