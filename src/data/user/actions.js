import * as types from './actionTypes'

/** Logout a user */
export const logoutUser = (sessionExpired = false) => ({ type: types.LOGOUT_USER, sessionExpired })

/** Clearing state and closing menus */
export const flushState = () => ({ type: types.FLUSH_STATE })
export const closeMenu = () => ({ type: types.CLOSE_MENU })
export const toggleMenu = () => ({ type: types.TOGGLE_MENU })

/** Handling PDF download requests */
export const downloadPdfRequest = () => ({ type: types.DOWNLOAD_PDF_REQUEST })
export const resetDownloadError = () => ({ type: types.RESET_DOWNLOAD_PDF_ERROR })
export const clearPdfFile = () => ({ type: types.CLEAR_PDF_FILE })

export const startRefreshJwt = () => ({ type: types.REFRESH_JWT })
export const cancelRefreshToken = () => ({ type: types.CANCEL_REFRESH_JWT })