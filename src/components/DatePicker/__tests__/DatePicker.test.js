import React from 'react'
import { shallow } from 'enzyme'
import { DatePicker } from '../index'

const props = {
  value: new Date('10/11/2017'),
  onChange: () => {},
  name: 'date-picker',
  label: 'Date picker',
  disabled: false,
  required: false,
  dateFormat: 'MM/DD/YYYY'
}

describe('DatePicker component', () => {
  test('should render correctly', () => {
    expect(shallow(<DatePicker {...props} />)).toMatchSnapshot()
  })
})