import { types } from './actions'

export const INITIAL_STATE = {
  byId: {},
  allIds: [],
  count: 0
}

const projectReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.GET_PROJECT_SUCCESS:
    case types.ADD_PROJECT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload
          }
        },
        allIds: state.allIds.indexOf(action.payload.id) === -1
          ? [...state.allIds, action.payload.id]
          : [...state.allIds]
      }
    case types.REMOVE_PROJECT:
      console.log('remove project ',action)
      let updatedById = state.byId
      const updatedAllIds = state.allIds.filter(value => value !== action.projectId)
      delete updatedById[action.projectId] // remove the project from project list "byId"
      return {
        ...state,
        byId: {
          ...updatedById
        },
        allIds: updatedAllIds
      }
    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default projectReducer
