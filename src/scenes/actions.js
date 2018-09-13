import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  LOGOUT_USER: 'LOGOUT_USER',
  CLOSE_MENU: 'CLOSE_MENU',
  TOGGLE_MENU: 'TOGGLE_MENU',
  FLUSH_STATE: 'FLUSH_STATE',
  DOWNLOAD_PDF_REQUEST: 'DOWNLOAD_PDF_REQUEST',
  DOWNLOAD_PDF_SUCCESS: 'DOWNLOAD_PDF_SUCCESS',
  DOWNLOAD_PDF_FAIL: 'DOWNLOAD_PDF_FAIL',
  RESET_DOWNLOAD_PDF_ERROR: 'RESET_DOWNLOAD_PDF_ERROR',
  CLEAR_PDF_FILE: 'CLEAR_PDF_FILE',
  REFRESH_JWT: 'REFRESH_JWT',
  CANCEL_REFRESH_JWT: 'CANCEL_REFRESH_JWT'
}

export default {
  logoutUser: makeActionCreator(types.LOGOUT_USER, 'sessionExpired'),
  flushState: makeActionCreator(types.FLUSH_STATE),
  closeMenu: makeActionCreator(types.CLOSE_MENU),
  toggleMenu: makeActionCreator(types.TOGGLE_MENU),
  downloadPdfRequest: makeActionCreator(types.DOWNLOAD_PDF_REQUEST),
  resetDownloadError: makeActionCreator(types.RESET_DOWNLOAD_PDF_ERROR),
  clearPdfFile: makeActionCreator(types.CLEAR_PDF_FILE),
  startRefreshJwt: makeActionCreator(types.REFRESH_JWT),
  cancelRefreshToken: makeActionCreator(types.CANCEL_REFRESH_JWT)
}