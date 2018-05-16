/**
 * Search for matches for a number of properties of an object in an array
 * @param arr
 * @param searchValue
 * @param properties
 * @returns {*}
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
 * @param x
 * @param p
 * @returns {string}
 */
const convertValuesToString = (x,p) => {
  return ['dateLastEdited', 'startDate', 'endDate'].includes(p)
    ? new Date(x[p]).toLocaleDateString()
    : x[p]
}

export default { searchForMatches }