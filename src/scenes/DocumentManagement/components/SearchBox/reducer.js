import { types } from './actions'
import { createAutocompleteReducer, INITIAL_STATE as AUTO_INITIAL_STATE } from 'data/autocomplete/reducer'

export const INITIAL_STATE = {
  params: {
    project: {
      name: '',
      id: null
    },
    jurisdiction: {
      name: '',
      id: null
    },
    uploadedDate: '',
    uploadedBy: '',
    name: '',
    uploadedDaysRange: '1'
  },
  searchValue: ''
}

export const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FORM_VALUE_CHANGE:
      return {
        ...state,
        params: {
          ...state.params,
          [action.property]: action.value
        }
      }

    case types.SEARCH_VALUE_CHANGE:
      return {
        ...state,
        searchValue: action.value
      }

    case types.CLEAR_SEARCH_STRING:
      return {
        ...state,
        searchValue: ''
      }

    case types.CLEAR_FORM:
      return {
        ...state,
        params: INITIAL_STATE.params
      }

    default:
      return state
  }
}

const projectAutocomplete = createAutocompleteReducer('PROJECT', '_MAIN')
const jurisdictionAutocomplete = createAutocompleteReducer('JURISDICTION', '_MAIN')

export const COMBINED_INITIAL_STATE = {
  form: INITIAL_STATE,
  projectSuggestions: AUTO_INITIAL_STATE,
  jurisdictionSuggestions: AUTO_INITIAL_STATE
}

const search = (state = COMBINED_INITIAL_STATE, action) => ({
  form: searchReducer(state.form, action),
  projectSuggestions: projectAutocomplete(state.projectSuggestions, action),
  jurisdictionSuggestions: jurisdictionAutocomplete(state.jurisdictionSuggestions, action)
})

export default search