/**
 * This collects all of the logic through the application into one array that is passed to redux-logic middleware.
 */
import { createLogic } from 'redux-logic'
import { types } from 'data/users/actions'
import scenesLogic from 'scenes/logic'
import dataLogic from 'data/logic'
import { logout, getSamlToken } from 'services/authToken'
import { persistor } from 'services/store'
import axios from 'axios'

/**
 * Logic for when the user logs out. Flushes the state calls logout from authToken service
 */
const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  async process({ action, api }, dispatch, done) {
    // if saml enabled, do saml logout first
    if (APP_IS_SAML_ENABLED === '1') {
      samsLogout()
    } else {
      logout()
    }

    dispatch({ type: types.FLUSH_STATE, isLogout: true })
    await persistor.flush()
    await persistor.purge()
    done()
  }
})

const samsLogout = async () => {

  const user = getSamlToken()
  let parsedUser = JSON.parse(user.substring(1,user.length-1))
  try {
    axios.get('/logout', {
      params: {
        nameID: parsedUser.nameID,
        nameIDFormat: parsedUser.nameIDFormat,
        sessionIndex: parsedUser.sessionIndex
      }
    })
      .then(res => {
        logout()
        const logoutURL = res.data
        location.href=logoutURL
      })
  } catch (err) {
    return err
  }
}
// using cooking section
// const samsLogout = async () => {
//
//   const user = getCookie('user').trim()
//   let parsedUser = JSON.parse(user.substring(1,user.length-1))
//   try {
//     axios.get('/logout', {
//       params: {
//         nameID: parsedUser.nameID,
//         nameIDFormat: parsedUser.nameIDFormat,
//         sessionIndex: parsedUser.sessionIndex
//       }
//     })
//         .then(res => {
//           logout()
//           const logoutURL = res.data
//           location.href=logoutURL
//         })
//   } catch (err) {
//     return err
//   }
// }
//
// const getCookie = (cname) => {
//   let name = cname + '='
//   let ca = document.cookie.split(';')
//   for(let i = 0; i < ca.length; i++) {
//     let c = ca[i]
//     while (c.charAt(0) === ' ') {
//       c = c.substring(1)
//     }
//     if (c.indexOf(name) === 0) {
//       return c.substring(name.length, c.length)
//     }
//   }
//   return ''
// }

export default [
  ...dataLogic,
  ...scenesLogic,
  logoutLogic
]
