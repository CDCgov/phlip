import React from 'react'
import { shallow } from 'enzyme'
import { DatePicker } from '../index'

const props = {
  input: { onChange: () => {}, value: new Date('10/11/2017') },
  name: 'date-picker',
  label: 'Date picker',
  meta: { touched: false, error: false, warning: false },
  disabled: false,
  required: false,
  dateFormat: 'MM/DD/YYYY'
}

describe('DatePicker component', () => {
  test('should render correctly', () => {
    expect(shallow(<DatePicker {...props} />)).toMatchSnapshot()
  })
})