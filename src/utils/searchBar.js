import moment from 'moment'

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
  let dateArray = []
  let date1,date2
  try {
    dateArray = JSON.parse(search)
    if (dateArray.length > 0) {
      date1 = moment.utc(dateArray[0].concat('T00:00:00'),'MM/DD/YYYYThh:mm:ss')
      date2 = moment.utc(dateArray[1].concat('T23:59:59'),'MM/DD/YYYYThh:mm:ss')
    }
  } catch(e) {
    // do nothing
  }
  return arr.filter(x => {
    return properties.some(p => {
      if (p === 'uploadedDate'){
        return searchDateBetween(x,p,date1,date2)
      } else {
        return convertValuesToString(x, p).trim().toLowerCase().includes(search)
      }
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
const convertValuesToString = (x, p) => {
  return ['dateLastEdited', 'startDate', 'endDate'].includes(p)
    ? moment.utc(x[p]).local().format('M/D/YYYY')
    : x[p]
}

const searchDateBetween = (x,p,date1,date2) => {
  return moment.utc(x[p]).isBetween(date1,date2,null,'[]')
}
export default { searchForMatches }