export const mapArray = (arr, key = 'id') => arr.map(p => p[key])

export const arrayToObject = (arr, key = 'id') => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

export const getInitials = (firstName, lastName) => {
  return lastName.length
    ? firstName[0] + lastName[0]
    : firstName[0] + ''
}

export default { mapArray, arrayToObject, getInitials }