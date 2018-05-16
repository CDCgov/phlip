/**
 * Makes an array the items in the array are a property from items in the array
 * @param arr
 * @param key
 * @returns {*}
 */
export const mapArray = (arr, key = 'id') => arr.map(p => p[key])

/**
 * Makes an object from an array of objects where the keys of the object are a property of the object in the array
 * @param arr
 * @param key
 * @returns {{}}
 */
export const arrayToObject = (arr, key = 'id') => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

/**
 * Gets the initials (first character of first name, first character of lastName)
 * @param firstName
 * @param lastName
 * @returns {string}
 */
export const getInitials = (firstName, lastName) => {
  return lastName.length
    ? firstName[0] + lastName[0]
    : firstName[0] + ''
}

export default { mapArray, arrayToObject, getInitials }