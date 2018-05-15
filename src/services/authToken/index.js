import memoize from 'lodash/memoize'
import jwtDecode from 'jwt-decode'

const TOKEN_KEY = 'esquire_token'

const getItem = key => () => window.sessionStorage.getItem(key)
const setItem = key => value => window.sessionStorage.setItem(key, value)
const removeItem = key => () => window.sessionStorage.removeItem(key)

const getAuthToken = getItem(TOKEN_KEY)
const setAuthToken = setItem(TOKEN_KEY)
const removeAuthToken = removeItem(TOKEN_KEY)
const memoizedGetAuthToken = memoize(getAuthToken)

export const login = (token) => {
  memoizedGetAuthToken.cache.clear()
  setAuthToken(token)
}

export const isLoggedInTokenExists = () => {
  return !!memoizedGetAuthToken(TOKEN_KEY)
}

export const logout = () => {
  removeAuthToken()
  memoizedGetAuthToken.cache.clear()
}

export const getToken = () => memoizedGetAuthToken(TOKEN_KEY)

export const decodeToken = token => {
  return jwtDecode(token)
}

export const isTokenExpired = () => {
  const token = decodeToken(getToken())
  const current = Date.now() / 1000
  return current > token.exp
}