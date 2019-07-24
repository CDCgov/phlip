import { createLogic } from 'redux-logic'
import { types } from './actions'

const getStateSuffix = createLogic({
  type: [
    `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
    `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
    `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_PROJECT`
  ],
  transform({ action }, next) {
    const suffix = action.suffix.slice(1)
    next({
      ...action,
      stateSuffix: suffix.toLowerCase()
    })
  }
})

const getJurisdictionSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
  latest: true,
  validate({ action, getState }, allow, reject) {
    const selected = getState()[`autocomplete.jurisdiction.${action.stateSuffix}`].selectedSuggestion
    if (Object.keys(selected).length === 0) {
      allow(action)
    } else {
      if (selected.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  },
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
        dispatch({
          type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_JURISDICTION${action.suffix}`,
          payload: jurisdictions
        })
      }
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_JURISDICTION${action.suffix}` })
    }
    done()
  }
})

const getProjectSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
  latest: true,
  validate({ action, getState }, allow, reject) {
    const selected = getState()[`autocomplete.project.${action.stateSuffix}`].selectedSuggestion
    if (Object.keys(selected).length === 0) {
      allow(action)
    } else {
      if (selected.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  },
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

/**
 * Returns a list of projects for the user
 */
const getProjectsByUserLogic = createLogic({
  type: [types.GET_INITIAL_PROJECT_SUGGESTION_REQUEST, `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_PROJECT`],
  validate({ action, getState }, allow, reject) {
    const selected = getState()[`autocomplete.project.${action.stateSuffix}`].selectedSuggestion
    if (Object.keys(selected).length === 0) {
      allow(action)
    } else {
      if (selected.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  },
  async process({ api, action }, dispatch, done) {
    try {
      let projects = await api.searchProjectListByUser({}, {
        params: {
          userId: action.userId,
          count: action.count
        }
      }, {})
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT${action.suffix}`, payload: projects })
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_PROJECT${action.suffix}` })
    }
    done()
  }
})

export default [
  getStateSuffix,
  getJurisdictionSuggestionsLogic,
  getProjectSuggestionsLogic,
  getProjectsByUserLogic
]
