import axios from 'axios'
import { login } from '../authToken'
import { mockUsers } from '../../data/mockUsers'
import { updateById } from 'utils'

const isLoggedIn = () => true
const getToken = () => '1234546'
const mockToken = 'j4r98cm9rshsohxe8hskdfijd'

export const api = axios.create({
  baseURL: APP_API_URL,
  headers: {
    ...(isLoggedIn() ? { Authorization: `Bearer ${getToken()}` } : {})
  }
})

export default {
  login(user) {
    //return api.post('/login', user).then(res => {
      login(mockToken) //TODO: temporary
      // login(user.token)
      return mockUsers[mockUsers.map(x => x.email).indexOf(user.email)] //TODO: temporary
      // return res.data
   // })
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
    //return api.post('/users', user).then(res => user)
    return user //TODO: temporary
  },

  updateUser(user) {
    return api.put(`/user/${user.id}`).then(res => user)
    //return updateById(user, mockUsers) //TODO: temporary
  }
}

