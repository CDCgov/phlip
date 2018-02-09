export const checkIfAnswered = (item, userAnswers, id = 'id') => {
  return userAnswers.hasOwnProperty(item[id]) &&
    Object.keys(userAnswers[item[id]].answers).length > 0
}

export const checkIfExists = (item, obj) => {
  return obj.hasOwnProperty(item.id)
}