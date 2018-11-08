import { types } from './actions'

const INITIAL_STATE = {
  byId: {},
  allIds: []
}

const jurisdictionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_JURISDICTION:
    case types.GET_JURISDICTION_SUCCESS:
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

export default jurisdictionReducer