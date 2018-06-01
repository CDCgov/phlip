import * as types from './actionTypes'

const INITIAL_STATE = {
  currentUser: {},
  menuOpen: false,
  pdfError: '',
  pdfFile: null,
  isRefreshing: false
}

/**
 * Reducer for handling user related actions, mostly coming from the actions in the avatar menu
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{currentUser: {}, menuOpen: boolean, pdfError: string, pdfFile: null}}
 */
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CURRENT_USER:
    case types.CHECK_PIV_USER_SUCCESS:
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload
      }

    case types.UPDATE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: action.payload }
      }

    case types.REMOVE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: null }
      }

    case types.TOGGLE_MENU:
      return {
        ...state,
        menuOpen: !state.menuOpen
      }

    case types.CLOSE_MENU:
      return {
        ...state,
        menuOpen: false
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }

    case types.DOWNLOAD_PDF_REQUEST:
      return {
        ...state,
        menuOpen: false
      }

    case types.DOWNLOAD_PDF_FAIL:
      return {
        ...state,
        pdfError: 'We failed to download the help guide.'
      }

    case types.DOWNLOAD_PDF_SUCCESS:
      return {
        ...state,
        pdfError: '',
        pdfFile: new Blob([action.payload], { type: 'application/pdf' })
      }

    case types.CLEAR_PDF_FILE:
      return {
        ...state,
        pdfFile: null
      }

    case types.RESET_DOWNLOAD_PDF_ERROR:
      return {
        ...state,
        pdfError: ''
      }

    case types.REFRESH_JWT:
      return {
        ...state,
        isRefreshing: true
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer