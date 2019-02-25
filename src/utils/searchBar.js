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
  let parsedDateParts = []
  const offset = new Date().getTimezoneOffset()/60

  try {
    dateArray = JSON.parse(search)
    if (dateArray.length > 1) {
      date1 = moment(dateArray[0],'MM/DD/YYYY')
      date2 = moment(dateArray[1],'MM/DD/YYYY')
      if (date1 > date2) {
        const tmpdate = date1
        date1 = date2
        date2 = tmpdate
      }
      date2 = date2.add(offset,'hours')
    } else {
      parsedDateParts = dateArray[0].split('*')
      date1 = moment(parsedDateParts[1],'MM/DD/YYYY').add(offset,'hours')
    }
  } catch(e) {
    // do nothing
  }
  return arr.filter(x => {
    return properties.some(p => {
      if (p === 'uploadedDate') {
        if (dateArray.length > 1) {
          return searchDateBetween(x,p,date1,date2)
        } else if (dateArray.length === 1) {

          return searchOneDate(x,p,parsedDateParts[0], date1)
        }
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
  return ['dateLastEdited', 'startDate', 'endDate','uploadedDate'].includes(p)
    ? moment.utc(x[p]).local().format('M/D/YYYY')
    : x[p]
}

const searchDateBetween = (x,p,date1,date2) => {
  return moment(x[p]).local().isBetween(moment.utc(date1),moment.utc(date2),'day','[]')
}

const searchOneDate = (x,p,operator,date) => {

  if (operator === 'le') {
    return moment.utc(x[p]).local().isSameOrBefore(moment.utc(date),'day')
  } else {
    return moment.utc(x[p]).local().isSameOrAfter(moment.utc(date),'day')
  }
}

export default { searchForMatches }