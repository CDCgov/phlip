const mapArray = (arr, key = 'id') => arr.map(p => p[key])

const arrayToObject = (arr, key = 'id') => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

export default { mapArray, arrayToObject }