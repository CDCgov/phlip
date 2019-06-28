import { types } from './actions'

export const INITIAL_STATE = {
  formError: null,
  goBack: false,
  submitting: false
}

/**
 * Reducer for the AddEditProject scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{formError: null, goBack: boolean}}
 */
const addEditProjectReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.ADD_PROJECT_FAIL:
    case types.UPDATE_PROJECT_FAIL:
    case types.DELETE_PROJECT_FAIL:
      return {
        ...state,
        formError: action.payload,
        goBack: false,
        submitting: false
      }

    case types.DELETE_PROJECT_SUCCESS:
    case types.UPDATE_PROJECT_SUCCESS:
    case types.ADD_PROJECT_SUCCESS:
      return {
        ...state,
        formError: null,
        goBack: true,
        submitting: false
      }

    case types.RESET_FORM_ERROR:
      return {
        ...state,
        formError: null
      }

    case types.ADD_PROJECT_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    case types.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: true,
        goBack: false
      }

    default:
      return state
  }
}

export default addEditProjectReducer
