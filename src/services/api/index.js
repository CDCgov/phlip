import axios from 'axios'
import { login, logout } from '../authToken'
import { scheme, outline } from 'data/mockCodingScheme'

export const api = axios.create({
  baseURL: '/api'
})

export default {
  login(user) {
    return api.post('/users/authenticate', user).then(res => {
      login(res.data.token.value)
      return res.data
    })
  },

  logoutUser() {
    return new Promise(resolve => resolve(logout()))
  },

  getProjects() {
    return api.get('/projects').then(res => res.data)
  },

  addProject(project) {
    return api.post('/projects', project).then(res => res.data)
  },

  updateProject(project) {
    return api.put(`/projects/${project.id}`, project).then(res => res.data)
  },

  getUsers() {
    return api.get('/users').then(res => res.data.users)
  },

  addUser(user) {
    return api.post('/users', user).then(res => res.data.newUser)
  },

  updateUser(user) {
    return api.put(`/users/${user.id}`, user).then(res => res.data)
  },

  getUserBookmarks(id) {
    return api.get(`/users/${id}/bookmarkedprojects`).then(res => res.data)
  },

  addUserBookmark(userId, projectId) {
    return api.post(`/users/${userId}/bookmarkedprojects/${projectId}`).then(res => res.data)
  },

  removeUserBookmark(userId, projectId) {
    return api.delete(`/users/${userId}/bookmarkedprojects/${projectId}`).then(res => res.data)
  },

  searchJurisdictionList(searchString) {
    return api.get('/jurisdictions', {
      params: {
        name: searchString
      }
    }).then(res => res.data)
  },

  getProjectJurisdictions(projectId) {
    return api.get(`/projects/${projectId}/jurisdictions`).then(res => res.data)
  },

  addJurisdictionToProject(projectId, jurisdiction) {
    return api.post(`/projects/${projectId}/jurisdictions/${jurisdiction.id}`, jurisdiction).then(res => res.data)
  },

  updateJurisdictionInProject(projectId, jurisdiction) {
    return api.put(`/projects/${projectId}/jurisdictions/${jurisdiction.id}`, jurisdiction).then(res => res.data)
  },

  reorderScheme(outline, projectId) {
    return api.put(`/projects/${projectId}/codingscheme`, outline).then(res => res.data)
  },

  addQuestion(question, projectId) {
    return api.post(`/projects/${projectId}/codingscheme`, question).then(res => res.data)
  },

  updateQuestion(question, projectId, questionId) {
    return api.put(`/projects/${projectId}/codingscheme/${questionId}`, question).then(res => res.data)
  },

  getScheme(projectId) {
    return api.get(`/projects/${projectId}/codingscheme`).then(res => res.data)
  },

  getQuestion(projectId, jurisdictionId, userId, questionId) {
    return api.get(`/projects/${projectId}/codingscheme/${questionId}`).then(res => res.data)
  }
}
