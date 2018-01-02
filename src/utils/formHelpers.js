import moment from 'moment'

export const validateRequired = value => value ? undefined : 'Required'

export const validateDate = value => {
  return value === 'mm/dd/yyyy' || value === undefined ? 'Required' : undefined
}

export const validateDateRanges = values => {
  let errors = { }
  if (values.startDate) {
    if (moment(values.endDate) < moment(values.startDate)) {
      errors.endDate = 'End date must be later than start date'
    }
  }
  return errors
}