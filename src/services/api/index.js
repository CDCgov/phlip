import axios from 'axios'
import { login, getToken, logout } from '../authToken'
import { mockUsers } from '../../data/mockUsers'
import { updateById } from 'utils'

export const api = axios.create({
  baseURL: '/api'
})

export default {
  login(user) {
    return api.post('/security/authenticate', user).then(res => {
      login(res.data.token.value)
      api.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`
      return res.data
    })
  },

  logoutUser() {
    return new Promise(resolve => {
      resolve(logout())
    })
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
    //return api.get('/users').then(res => res.data)
    return mockUsers //TODO: temporary
  },

  addUser(user) {
    return api.post('/security/addUser', user).then(res => {
      return user //TODO: temporary
      //return res.data
    })
  },

  updateUser(user) {
    return api.put(`/user/${user.id}`).then(res => user)
    //return updateById(user, mockUsers) //TODO: temporary
  }
}

