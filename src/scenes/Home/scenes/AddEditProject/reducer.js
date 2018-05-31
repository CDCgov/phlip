import * as types from '../../actionTypes'

const INITIAL_STATE = {
  formError: null,
  goBack: false
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
      return {
        ...state,
        formError: action.payload,
        goBack: false
      }

    case types.UPDATE_PROJECT_SUCCESS:
    case types.ADD_PROJECT_SUCCESS:
      return {
        ...state,
        formError: null,
        goBack: true
      }

    case types.RESET_FORM_ERROR:
      return {
        ...state,
        formError: null
      }

    case types.ADD_PROJECT_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        goBack: false
      }

    default:
      return state
  }
}

export default addEditProjectReducer