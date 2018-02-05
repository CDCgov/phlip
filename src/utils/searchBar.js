// Search for matches for a number of properties of an object in an array
const searchForMatches = (arr, searchValue, properties) => {
  const search = searchValue.trim().toLowerCase()
  return arr.filter(x => {
    return properties.some(p => {
      return convertValuesToString(x, p).trim().toLowerCase().includes(search)
    })
  })
}

const convertValuesToString = (x,p) => {
  return ['dateLastEdited', 'startDate', 'endDate'].includes(p)
    ? new Date(x[p]).toLocaleDateString()
    : x[p]
}

export default { searchForMatches }