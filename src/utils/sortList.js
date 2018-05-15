/**
 * Sorts a list
 * @param list
 * @param sortBy
 * @param direction
 * @returns {*}
 */
const sortList = (list, sortBy, direction) => {
  return (
    direction === 'asc'
      ? list.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0))
      : list.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : b[sortBy] > a[sortBy] ? 1 : 0))
  )
}

export default sortList
