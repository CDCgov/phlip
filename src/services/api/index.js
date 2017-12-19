import axios from 'axios'
import { login, getToken, logout } from '../authToken'
import { updateById } from 'utils'

export const api = axios.create({
  baseURL: '/api'
})

export default {
  login(user) {
    return api.post('/security/authenticate', user).then(res => {
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
    return api.get('/security/users').then(res => res.data.users)
  },

  addUser(user) {
    return api.post('/security/addUser', user).then(res => res.data.newUser)
  },

  updateUser(user) {
    return api.put(`/user/${user.userId}`).then(res => user)
    //return updateById(user, mockUsers) //TODO: temporary
  },

  addUserBookmark(userId, projectId) {
    return api.post(`/bookmarks/${userId}/${projectId}`).then(res => res.data)
  },

  removeUserBookmark(userId, projectId) {
    return api.delete(`/bookmarks/${userId}/${projectId}`).then(res => res.data)
  }
}

