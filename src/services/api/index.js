import axios from 'axios'
import { login, logout } from '../authToken'

export const api = axios.create({
  baseURL: process.env.API_HOST || '/api'
})

export default {
  // Login a user, called in Login/logic
  login(user) {
    return api.post('/users/authenticate', user).then(res => {
      login(res.data.token.value)
      return res.data
    })
  },

  // Check for user after SAML login
  checkPivUser(tokenObj) {
    return api.get(`/users?email=${tokenObj.decodedToken.userEmail}`, {
      headers: {
        'Authorization': `Bearer ${tokenObj.token}`
      }
    }).then(res => {
      if (res.data) {
        login(res.data.token.value)
      }
      return res.data
    })
  },

  // Logout a user, called in src/logic
  logoutUser() {
    return new Promise(resolve => resolve(logout()))
  },

  // Get all projects, called in Home/logic
  getProjects() {
    return api.get('/projects').then(res => res.data)
  },

  // Add a project, called in Home/scenes/AddEditProject/logic
  addProject(project) {
    return api.post('/projects', project).then(res => res.data)
  },

  // Update a project, called in Home/scenes/AddEditProject/logic
  updateProject(project) {
    return api.put(`/projects/${project.id}`, project).then(res => res.data)
  },

  // Get all users, called in Admin/logic
  getUsers() {
    return api.get('/users').then(res => res.data)
  },

  // Add a user, called in Admin/scenes/AddEditUser/logic
  addUser(user) {
    return api.post('/users', user).then(res => res.data)
  },

  // Update a user, called in Admin/scenes/AddEditUser/logic
  updateUser(user) {
    return api.put(`/users/${user.id}`, user).then(res => res.data)
  },

  // Adds an avatar to a user, called in Admin/scenes/AddEditUser/logic
  addUserPicture(userId, avatarFile) {
    return api.post(`/users/${userId}/avatar`, avatarFile).then(res => {
      let returnObj = {
        userId: userId,
        data: res.data
      }
      return returnObj
    })
  },

  // Deletes an avatar for a user, called in Admin/scenes/AddEditUser/logic
  deleteUserPicture(userId) {
    return api.delete(`/users/${userId}/avatar`).then(res => res.data)
  },

  // Get project bookmarks for a user, called in Login/logic
  getUserBookmarks(id, token) {
    return api.get(`/users/${id}/bookmarkedprojects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.data)
  },

  // Add a user bookmark, called in Home/logic
  addUserBookmark(userId, projectId) {
    return api.post(`/users/${userId}/bookmarkedprojects/${projectId}`).then(res => res.data)
  },

  // Remove a user bookmark, called in Home/logic
  removeUserBookmark(userId, projectId) {
    return api.delete(`/users/${userId}/bookmarkedprojects/${projectId}`).then(res => res.data)
  },

  // Search master jurisdiction list, called in Home/scenes/AddEditJurisdictions/logic
  searchJurisdictionList(searchString) {
    return api.get('/jurisdictions', {
      params: {
        name: searchString
      }
    }).then(res => res.data)
  },

  // Get jurisdictions for a project, called in Home/scenes/AddEditJurisdictions/logic
  getProjectJurisdictions(projectId) {
    return api.get(`/projects/${projectId}/jurisdictions`).then(res => res.data)
  },

  // Add a jurisdiction to a project, called in Home/scenes/AddEditJurisdictions/logic
  addJurisdictionToProject(projectId, jurisdiction) {
    return api.post(`/projects/${projectId}/jurisdictions`, jurisdiction).then(res => res.data)
  },

  // Update a jurisdiction on a project, called in Home/scenes/AddEditJurisdictions/logic
  updateJurisdictionInProject(projectId, jurisdiction) {
    return api.put(`/projects/${projectId}/jurisdictions/${jurisdiction.id}`, jurisdiction).then(res => res.data)
  },

  // Add a preset jurisdiction list (like US States), called in Home/scenes/AddEditJurisdiction/logic
  addPresetJurisdictionList(projectId, jurisdiction) {
    return api.post(`/projects/${projectId}/jurisdictions/preset`, jurisdiction).then(res => res.data)
  },

  // Reorder a project's coding scheme, called in CodingScheme/logic
  reorderScheme(outline, projectId) {
    return api.put(`/projects/${projectId}/scheme`, outline).then(res => res.data)
  },

  // Add a question to the project coding scheme, called in CodingScheme/scenes/AddEditQuestion/logic
  addQuestion(question, projectId) {
    return api.post(`/projects/${projectId}/scheme`, question).then(res => res.data)
  },

  // Update a question in a project coding scheme, called in CodingScheme/scenes/AddEditQuestion/logic
  updateQuestion(question, projectId, questionId) {
    return api.put(`/projects/${projectId}/scheme/${questionId}`, question).then(res => res.data)
  },

  deleteQuestion(projectId, questionId) {
    return api.delete(`/projects/${projectId}/scheme/${questionId}`).then(res => res.data)
  },

  // Get a project's coding scheme, called in CodingScheme/logic, Coding/Logic, Validation/logic
  getScheme(projectId) {
    return api.get(`/projects/${projectId}/scheme`).then(res => res.data)
  },

  lockCodingScheme(projectId, userId) {
    return api.post(`/locks/scheme/projects/${projectId}/users/${userId}`).then(res => res.data)
  },

  getCodingSchemeLockInfo(projectId) {
    return api.get(`/locks/scheme/projects/${projectId}`).then(res => res.data)
  },

  unlockCodingScheme(projectId, userId) {
    return api.delete(`/locks/scheme/projects/${projectId}/users/${userId}`).then(res => res.data)
  },

  lockProtocol(projectId, userId) {
    return api.post(`/locks/protocol/projects/${projectId}/users/${userId}`).then(res => res.data)
  },

  getProtocolLockInfo(projectId) {
    return api.get(`/locks/protocol/projects/${projectId}`).then(res => res.data)
  },

  unlockProtocol(projectId, userId) {
    return api.delete(`/locks/protocol/projects/${projectId}/users/${userId}`).then(res => res.data)
  },

  // Get a scheme question, called in Coding/logic, Validation/logic
  getSchemeQuestion(questionId, projectId) {
    return api.get(`/projects/${projectId}/scheme/${questionId}`).then(res => res.data)
  },

  // Gets user coded questions for a project and jurisdiction, called in Coding/logic
  getUserCodedQuestions(userId, projectId, jurisdictionId) {
    return api.get(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions`)
      .then(res => res.data)
  },

  // Get a single coded questions for a scheme question, called in Coding/logic
  getCodedQuestion({ questionId, projectId, jurisdictionId, userId }) {
    return api.get(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`)
      .then(res => res.data)
  },

  // Create an empty coded question object, called in Coding/logic, Validation/logic
  answerCodedQuestion({ questionId, projectId, jurisdictionId, userId, questionObj }) {
    return api.post(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`, questionObj)
      .then(res => res.data)
  },

  // Answer a question for a user (creates a coded question), jurisdiction and project, called in Coding/logic
  updateCodedQuestion({ questionId, projectId, jurisdictionId, userId, questionObj }) {
    return api.put(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`, questionObj)
      .then(res => res.data)
  },

  // Saves a red flag for a schemequestion, called in Coding/logic
  saveRedFlag(questionId, flagInfo) {
    return api.post(`/flags/schemequestionflag/${questionId}`, { ...flagInfo }).then(res => res.data)
  },

  // Clears a flag based on flag id, called in Validation/logic
  clearFlag(flagId) {
    return api.delete(`/flags/${flagId}`).then(res => res.data)
  },

  // Get a single validated question, called in Validation/logic
  getUserValidatedQuestion({ projectId, jurisdictionId, questionId }) {
    return api.get(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`)
      .then(res => res.data)
  },

  // Gets all validated questions for a jurisdiction and project, called in Validation/logic
  getValidatedQuestions(projectId, jurisdictionId) {
    return api.get(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions`).then(res => res.data)
  },

  // Create an empty validated question, called in Validation/logic
  answerValidatedQuestion({ projectId, jurisdictionId, questionId, questionObj }) {
    return api.post(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`, questionObj)
      .then(res => res.data)
  },

  // Validates a question for a jurisdiction and project, called in Validation/logic
  updateValidatedQuestion({ projectId, jurisdictionId, questionId, questionObj }) {
    return api.put(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`, questionObj)
      .then(res => res.data)
  },

  updateUserImage(userId, operation) {
    return api.patch(`/users/${userId}`, operation).then(res => {
      return operation[0].value
    }).catch(error => {
      return error
    })
  },

  getUserImage(userId) {
    return api.get(`/users/${userId}/avatar`).then(res => res.data)
  },

  // Get all coded questions for a specific question
  getAllCodedQuestionsForQuestion(projectId, jurisdictionId, questionId) {
    return api.get(`/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`)
      .then(res => res.data)
  },

  // Gets a picture for user, called in Admin/scenes/AddEditUser/logic, Validation/logic
  // getUserPicture(userId) {
  //   return api.get(`/users/${userId}/avatar`).then(res => {
  //     return res.status !== 204
  //   }).catch(error => {
  //     return false
  //   })
  // },

  deleteUserImage(userId, operation) {
    return api.patch(`/users/${userId}`, operation).then(res => res.data)
  },

  getProtocol(projectId) {
    return api.get(`/projects/${projectId}/protocol`).then(res => res.data.text)
  },

  // Saves the protocol for a project, called in Protocol/logic
  saveProtocol(projectId, userId, protocol) {
    return api.put(`/projects/${projectId}/protocol`, { userId, text: protocol }).then(res => res.data)
  },

  getCodersForProject(projectId) {
    return api.get(`/projects/${projectId}/coders`).then(res => res.data)
  },

  // Export project data
  exportData(projectId, type) {
    return api.get(`/exports/project/${projectId}/data`, { params: { type } }).then(res => res.data)
  }
}
