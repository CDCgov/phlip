/**
 * Makes an array the items in the array are a property from items in the array
 *
 * @param {Array} arr
 * @param {String} key
 * @returns {Array}
 */
export const mapArray = (arr, key = 'id') => arr.map(p => p[key])

/**
 * Makes an object from an array of objects where the keys of the object are a property of the object in the array
 *
 * @param {Array} arr
 * @param {String} key
 * @returns {Object}
 */
export const arrayToObject = (arr, key = 'id') => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

/**
 * Gets the initials (first character of first name, first character of lastName)
 *
 * @param {String} firstName
 * @param {String} lastName
 * @returns {String}
 */
export const getInitials = (firstName, lastName) => {
  return lastName.length
    ? firstName[0] + lastName[0]
    : firstName[0] + ''
}

/**
 *
 * @param arr
 * @param index
 * @param updatedItem
 * @returns {...*[]}
 */
export const updateItemAtIndex = (arr, index, updatedItem) => {
  arr.splice(index, 1, updatedItem)
  return [...arr]
}

export default { mapArray, arrayToObject, getInitials, updateItemAtIndex }