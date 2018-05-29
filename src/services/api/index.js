import axios from 'axios'
import { isLoggedInTokenExists, getToken, logout } from 'services/authToken'
import calls from './calls'

/**
 * AxiosInstance with baseURL /api
 * @type {AxiosInstance}
 */
export const instance = axios.create({
  baseURL: process.env.API_HOST || '/api'
})

/**
 * This function checks to make sure any error from the API isn't a 401. If it returns a 401 it will push '/login' onto
 * the browser history and logout the user
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.history
 * @param {Object} call
 * @returns {function(error : Object)}
 */
export const redirectIfTokenExpired = ({ history }, call) => error => {
  if (error.response.status === 401) {
    if (call.name === 'login' || call.name === 'checkPivUser') {
      history.push({
        pathname: '/login'
      })
    } else {
      logout()
      history.push({
        pathname: '/login', state: { sessionExpired: true }
      })
    }
  }
  throw error
}

/**
 * Prepares an API axios instance for the 'call' parameter
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.history
 * @returns {function(call : Object): function(data: Object, options: Object, urlParams: Object): Promise}
 */
const prepare = ({ history }) => call => (data, options, urlParams = {}) => {
  const baseHeaders = isLoggedInTokenExists() ? { Authorization: `Bearer ${getToken()}` } : {}
  const callHeaders = call.hasOwnProperty('headers') ? { ...call.headers(urlParams) } : {}
  const headers = { ...baseHeaders, ...callHeaders }

  return instance({
    ...options,
    data,
    method: call.method,
    url: call.path(urlParams),
    headers
  })
    .then(res => call.hasOwnProperty('returnObj') ? call.returnObj({ ...urlParams }, res) : res.data)
    .catch(redirectIfTokenExpired({ history }, call))
}

/**
 * Prepares a total API object to be passed to redux-logic
 *
 * @param {Object} dependencies
 * @returns {Object} - API object with an axios instance for each call from ./call.js
 */
const createApiHandler = dependencies => {
  const preparedApi = prepare(dependencies)

  const api = calls.reduce((apiObj, call) => ({
    ...apiObj,
    [call.name]: preparedApi(call)
  }), {})

  return api
}

export default createApiHandler
