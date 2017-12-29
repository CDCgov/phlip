import * as types from './actionTypes'
import { normalize } from 'utils'

const INITIAL_STATE = {
  jurisdictions: { byId: {}, allIds: [] },
  visibleJurisdictions: []
}

const addEditJurisdictionsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.GET_PROJECT_JURISDICTIONS_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: normalize.arrayToObject(action.payload),
          allIds: normalize.mapArray(action.payload)
        }
      }

    case types.UPDATE_PROJECT_JURISDICTION_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: { ...state.jurisdictions.byId, [action.payload.id]: action.payload },
          allIds: state.jurisdictions.allIds
        }
      }

    case types.ADD_PROJECT_JURISDICTION_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: {
            ...state.jurisdictions.byId,
            [action.payload.id]: action.payload
          },
          allIds: [action.payload.id, ...state.jurisdictions.allIds]
        },
        visibleJurisdictions: [action.payload.id, ...state.visibleJurisdictions]
      }

    case types.CLEAR_JURISDICTIONS:
      return INITIAL_STATE

    case types.GET_PROJECT_JURISDICTIONS_REQUEST:
    case types.UPDATE_PROJECT_JURISDICTION_REQUEST:
    case types.ADD_PROJECT_JURISDICTION_REQUEST:
    default:
      return state
  }
}

export default addEditJurisdictionsReducer