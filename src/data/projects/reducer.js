import { types } from './actions'

const INITIAL_STATE = {
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

    default:
      return state
  }
}

export default projectReducer