import axios from 'axios'
import { isLoggedInTokenExists, getToken, logout } from 'services/authToken'
import calls from './calls'

export const instance = axios.create({
  baseURL: process.env.API_HOST || '/api'
})

export const redirectIfTokenExpired = ({ history }, call) => error => {
  if (error.response.status === 401 && (call.name !== 'login' && call.name !== 'checkPivUser')) {
    logout()
    history.push({
      pathname: '/login' , state: { sessionExpired: true }
    })
  }
  throw error
}

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

const createApiHandler = dependencies => {
  const preparedApi = prepare(dependencies)

  const api = calls.reduce((apiObj, call) => ({
    ...apiObj,
    [call.name]: preparedApi(call)
  }), {})

  return api
}

export default createApiHandler
