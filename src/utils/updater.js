// Will take an item and update the corresponding item in an array by matching a property
const updateByProperty = (updatedItem, objectArray, prop) => {
  return objectArray.map(item =>
    (item[prop] === updatedItem[prop])
      ? updatedItem
      : item
  )
}

// Curried function. Will create a function by passing state and action, then that newly created function will take
// a list of strings that correspond to keys in state. It will update those keys by using the value in
// action.payload[key]
const updateItemsInState = (state, action) => items => ({
  ...state,
  ...items.reduce((obj, item) => {
    obj[item] = action.payload[item]
    return obj
  }, {})
})

export default { updateItemsInState, updateByProperty }