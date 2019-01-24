import projectLogic from './Home/logic'
import userLogic from './Admin/logic'
import loginLogic from './Login/logic'
import codingSchemeLogic from './CodingScheme/logic'
import protocolLogic from './Protocol/logic'
import codingValidationLogic from './CodingValidation/logic'
import docManageLogic from './DocumentManagement/logic'
import docViewLogic from './DocumentView/logic'

import { createLogic } from 'redux-logic'
import { types } from './actions'
import { getToken, decodeToken, login, isLoggedIn } from 'services/authToken'

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

export const refreshJwtLogic = createLogic({
  type: types.REFRESH_JWT,
  warnTimeout: 0,
  cancelType: [types.CANCEL_REFRESH_JWT, types.LOGOUT_USER],
  process({ cancelled$, api }) {
    const interval = setInterval(async () => {
      if (isLoggedIn()) {
        const currentToken = getToken()
        const newToken = await api.checkPivUser({ email: decodeToken(currentToken).Email }, {}, { tokenObj: { token: currentToken }})
        await login(newToken.token.value)
        console.log('refreshing')
      }
    }, 900000)

    cancelled$.subscribe(() => {
      clearInterval(interval)
    })
  }
})

/**
 * Collects all of the logic from scenes into one array
 */
export default [
  refreshJwtLogic,
  downloadPdfLogic,
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  ...codingSchemeLogic,
  ...codingValidationLogic,
  //...codingLogic,
  //...validationLogic,
  ...protocolLogic,
  ...docManageLogic,
  ...docViewLogic
]