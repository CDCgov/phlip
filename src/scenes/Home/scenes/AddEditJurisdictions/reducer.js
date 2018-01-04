import * as types from './actionTypes'
import { normalize, searchUtils } from 'utils'

const INITIAL_STATE = {
  jurisdictions: { byId: {}, allIds: [] },
  visibleJurisdictions: [],
  searchValue: '',
  suggestions: [],
  suggestionValue: '',
  jurisdiction: {}
}

const addEditJurisdictionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_PROJECT_JURISDICTIONS_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: normalize.arrayToObject(action.payload),
          allIds: normalize.mapArray(action.payload)
        },
        visibleJurisdictions: normalize.mapArray(action.payload)
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

    case types.UPDATE_JURISDICTION_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue,
        visibleJurisdictions: action.searchValue === ''
          ? state.jurisdictions.allIds
          : normalize.mapArray(searchUtils.searchForMatches(Object.values(state.jurisdictions.byId), action.searchValue, [
            'name', 'startDate', 'endDate'
          ]))
      }

    case types.UPDATE_SUGGESTION_VALUE:
      return {
        ...state,
        suggestionValue: action.suggestionValue
      }

    case types.SET_JURISDICTION_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload.filter(jurisdiction => {
          return !normalize.mapArray(Object.values(state.jurisdictions.byId), 'name').includes(jurisdiction.name)
        })
      }

    case types.ON_CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      }

    case types.ON_JURISDICTION_SELECTED:
      return {
        ...state,
        jurisdiction: action.jurisdiction,
        suggestionValue: action.jurisdiction.name
      }

    case types.CLEAR_JURISDICTIONS:
      return {
        ...state,
        suggestionValue: '',
        suggestions: [],
        jurisdiction: {}
      }

    case types.SEARCH_JURISDICTION_LIST:
    case types.GET_PROJECT_JURISDICTIONS_REQUEST:
    case types.UPDATE_PROJECT_JURISDICTION_REQUEST:
    case types.ADD_PROJECT_JURISDICTION_REQUEST:
    default:
      return state
  }
}

export default addEditJurisdictionsReducer