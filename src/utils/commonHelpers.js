/**
 * Slices a table for pagination
 * @param data
 * @param page
 * @param rowsPerPage
 * @returns {*}
 */
export const sliceTable = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

/**
 * Sorts a list
 * @param list
 * @param sortBy
 * @param direction
 * @returns {*}
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
 * @param id
 * @returns {function(*): {id: string, key: string}}
 */
const generateUniqueProps = id => header => ({
  id: `${id}-${header}`,
  key: `${id}-${header}`
})

export default { sliceTable, sortListOfObjects, generateUniqueProps }