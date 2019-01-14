/**
 * Search for matches for a number of properties of an object in an array
 *
 * @param {Array} arr
 * @param {String} searchValue
 * @param {Array} properties
 * @returns {Array}
 */
const searchForMatches = (arr, searchValue, properties) => {
  const search = searchValue.trim().toLowerCase()
  return arr.filter(x => {
    return properties.some(p => {
      return convertValuesToString(x, p).trim().toLowerCase().includes(search)
    })
  })
}

/**
 * Converts date values to strings for easy comparison
 *
 * @param {Object} x
 * @param {String} p
 * @returns {String}
 */
const convertValuesToString = (x,p) => {
  return ['dateLastEdited', 'startDate', 'endDate'].includes(p)
    ? new Date(x[p]).toLocaleDateString()
    : x[p]
}

export default { searchForMatches }