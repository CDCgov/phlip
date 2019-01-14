import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { getToken, decodeToken, login, isLoggedInTokenExists } from 'services/authToken'

export const downloadPdfLogic = createLogic({
  type: types.DOWNLOAD_PDF_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.DOWNLOAD_PDF_SUCCESS,
    failType: types.DOWNLOAD_PDF_FAIL
  },
  async process({ action, getState, api }) {
    return await api.getHelpPdf({}, { responseType: 'arraybuffer' }, {})
  }
})

export const refreshJwt = createLogic({
  type: types.REFRESH_JWT,
  warnTimeout: 0,
  cancelType: [types.CANCEL_REFRESH_JWT, types.LOGOUT_USER],
  process({ cancelled$, api}) {
    const interval = setInterval(async () => {
      if (isLoggedInTokenExists()) {
        const currentToken = getToken()
        const newToken = await api.checkPivUser({ email: decodeToken(currentToken).Email }, {}, { tokenObj: { token: currentToken }})
        await login(newToken.token.value)
      }
    }, 900000)

    cancelled$.subscribe(() => {
      clearInterval(interval)
    })
  }
})

export default [downloadPdfLogic, refreshJwt]