/**
 * Slices a table (data) for pagination
 *
 * @param {Array} data
 * @param {Number} page
 * @param {Number} rowsPerPage
 * @returns {Array}
 */
export const sliceTable = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

/**
 * Sorts a list of objects based on the parameter sortBy
 *
 * @param {Array} list
 * @param {*} sortBy
 * @param {String} direction
 * @returns {Array}
 */
export const sortListOfObjects = (list, sortBy, direction) => {
  return (
    direction === 'asc'
      ? list.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0))
      : list.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : b[sortBy] > a[sortBy] ? 1 : 0))
  )
}

/**
 * Generates a key and ID as props for a table
 *
 * @param {*} id
 * @returns {function(id: String): {id: *, key: String}}
 */
const generateUniqueProps = id => header => ({
  id: `${id}-${header}`,
  key: `${id}-${header}`
})

export const checkIfMultiWord = str => {
  return str.split(' ').length > 1
}

export default { sliceTable, sortListOfObjects, generateUniqueProps, checkIfMultiWord }