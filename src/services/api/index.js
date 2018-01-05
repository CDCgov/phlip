import axios from 'axios'
import { login, logout } from '../authToken'
import mockJurisdictions, { allJurisdictions } from 'data/mockJurisdictions'
import { scheme } from 'data/mockCodingScheme'

export const api = axios.create({
  baseURL: '/api'
})

export default {
  login (user) {
    return api.post('/users/authenticate', user).then(res => {
      login(res.data.token.value)
      return res.data
    })
  },

  logoutUser () {
    return new Promise(resolve => resolve(logout()))
  },

  getProjects () {
    return api.get('/projects').then(res => res.data)
  },

  addProject (project) {
    return api.post('/projects', project).then(res => res.data)
  },

  updateProject (project) {
    return api.put(`/projects/${project.id}`, project).then(res => res.data)
  },

  getUsers () {
    return api.get('/users').then(res => res.data.users)
  },

  addUser (user) {
    return api.post('/users', user).then(res => res.data.newUser)
  },

  updateUser (user) {
    return api.put(`/users/${user.id}`, user).then(res => res.data)
  },

  addUserBookmark (userId, projectId) {
    return api.post(`/users/${userId}/projectbookmarks/${projectId}`).then(res => res.data)
  },

  removeUserBookmark (userId, projectId) {
    return api.delete(`/users/${userId}/projectbookmarks/${projectId}`).then(res => res.data)
  },

  searchJurisdictionList (searchString) {
    /*return api.get('/jurisdiction', {
      params: {
        name: searchString
      }
    }).then(res => res.data)*/
    return getMatchingJurisdictions(searchString)
  },

  getProjectJurisdictions (projectId) {
    //return api.get(`/projects/${projectId}/jurisdiction`).then(res => res.data)
    return mockJurisdictions
  },

  addJurisdictionToProject (projectId, jurisdiction) {
    //return api.post(`/projects/${projectId}/jurisdiction`, jurisdiction).then(res => res.data)
    return { ...jurisdiction, id: Math.random() }
  },

  updateJurisdictionInProject (projectId, jurisdiction) {
    return jurisdiction
    //return api.put(`/projects/${projectId}/jurisdiction/${jurisdiction.id}`, jurisdiction).then(res => res.data)
  },

  getScheme (projectId) {
    return scheme
  }
}

const getMatchingJurisdictions = value => {
  const escapedValue = escapeRegexCharacters(value.trim())

  if (escapedValue === '') {
    return []
  }

  const regex = new RegExp('^' + escapedValue, 'i')

  return allJurisdictions.filter(jurisdiction => regex.test(jurisdiction))
}

const escapeRegexCharacters = str => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

