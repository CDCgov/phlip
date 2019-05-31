import { createLogic } from 'redux-logic'
import { types } from './actions'

const getJurisdictionSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
  async process({ action, api }, dispatch, done) {
    try {
      const jurisdictions = await api.searchJurisdictionList({}, {
        params: {
          name: action.searchString
        }
      }, {})
      if (action.index !== undefined && action.index !== null) {
        dispatch({
          type: `${types.SEARCH_ROW_SUGGESTIONS_SUCCESS}_JURISDICTION${action.suffix}`,
          payload: { suggestions: jurisdictions, index: action.index }
        })
      } else {
        dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_JURISDICTION${action.suffix}`, payload: jurisdictions })
      }
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_JURISDICTION${action.suffix}` })
    }
    done()
  }
})

const getProjectSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
  async process({ api, action }, dispatch, done) {
    try {
      let projects = await api.searchProjectList({}, {
        params: {
          name: action.searchString
        }
      }, {})
      
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT${action.suffix}`, payload: projects })
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_PROJECT${action.suffix}` })
    }
    done()
  }
})

const getProjectsByUserLogic = createLogic({
  type: types.GET_INITIAL_PROJECT_SUGGESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    try {
      // let projects = await api.getProjects({}, {
      let projects = await api.searchProjectListByUser({}, {
        params: {
          userId: action.userId,
          count: action.count
        }
      }, {})
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT`, payload: projects })
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_PROJECT` })
    }
    done()
  }
})

export default [
  getJurisdictionSuggestionsLogic,
  getProjectSuggestionsLogic,
  getProjectsByUserLogic
]
