// Search for matches for a number of properties of an object in an array
const searchForMatches = (arr, searchValue, properties) => {
  const search = searchValue.trim().toLowerCase()
  return arr.filter(x => {
    return properties.some(p => {
      return convertValuesToString(x[p]).trim().toLowerCase().includes(search)
    })
  })
}

const convertValuesToString = p => {
  return p instanceof Date
    ? p.toLocaleDateString()
    : p
}

export default { searchForMatches }