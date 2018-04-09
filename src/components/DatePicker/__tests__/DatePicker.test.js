import React from 'react'
import { shallow } from 'enzyme'
import { DatePicker } from '../index'

const props = {
  input: { onChange: () => {} },
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