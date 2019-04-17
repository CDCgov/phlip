import { types as userTypes } from 'data/users/actions'

/**
 * Slices a table (data) for pagination
 *
 * @param {Array} data
 * @param {Number} page
 * @param {Number} rowsPerPage
 * @returns {Array}
 */
export const sliceTable = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

/**
 * Sorts a list of objects based on the parameter sortBy
 *
 * @param {Array} list
 * @param {*} sortBy
 * @param {String} direction
 * @returns {Array}
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
 *
 * @param {*} id
 * @returns {function(id: String): {id: *, key: String}}
 */
const generateUniqueProps = id => header => ({
  id: `${id}-${header}`,
  key: `${id}-${header}`
})

/**
 * Checks if a string if multi-word based on spaces
 * @param str
 * @returns {boolean}
 */
export const checkIfMultiWord = str => {
  return str.split(' ').length > 1
}

/**
 * Handles determining if getting avatars is needed
 * @param users
 * @param allUserObjs
 * @param dispatch
 * @param api
 * @returns {Promise<any>}
 */
export const handleUserImages = (users, allUserObjs, dispatch, api) => {
  let avatar, errors = ''
  const now = Date.now()
  const oneday = 60 * 60 * 24 * 1000

  return new Promise(async (resolve, reject) => {
    if (users.length === 0) {
      resolve({ errors })
    }
    for (let i = 0; i < users.length; i++) {
      const { userId, ...coder } = users[i]
      try {
        if (allUserObjs.hasOwnProperty(userId)) {
          // the object already exists
          if ((now - allUserObjs[userId].lastCheck) > oneday) {
            avatar = await api.getUserImage({}, {}, { userId })
            dispatch({
              type: userTypes.UPDATE_USER,
              payload: {
                id: userId,
                avatar,
                lastCheck: now
              }
            })
          }
        } else {
          avatar = await api.getUserImage({}, {}, { userId })
          dispatch({
            type: userTypes.ADD_USER,
            payload: {
              id: userId,
              ...coder,
              avatar,
              lastCheck: now
            }
          })
        }
      } catch (error) {
        errors = 'Failed to get user images'
      }
      if (i === users.length - 1) {
        resolve({ errors })
      }
    }
  })
}

export default { sliceTable, sortListOfObjects, generateUniqueProps, checkIfMultiWord, handleUserImages }
