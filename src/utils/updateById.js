const updateById = (updatedItem, objectArray) => {
  return objectArray.map(item =>
    (item.id === updatedItem.id)
      ? updatedItem
      : item
  )
}

export default updateById