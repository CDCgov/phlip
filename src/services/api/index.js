import axios from 'axios'
import { login, logout } from '../authToken'

const mockAllCodedQuestions = {
  1: [
    {
      coder: { userId: 1, firstName: 'Admin', lastName: '' },
      codedQuestions: [
        {
          'id': 10019,
          'schemeQuestionId': 1,
          'flag': null,
          'comment': '',
          'codedAnswers': [
            {
              'id': 10010,
              'schemeAnswerId': 1,
              'pincite': 'dsfdfdsf',
              'textAnswer': null
            }
          ]
        }
      ]
    },
    {
      coder: { userId: 6, firstName: 'Kristin', lastName: 'Muterspaw' },
      codedQuestions: [
        {
          'id': 1,
          'schemeQuestionId': 1,
          'flag': {
            'id': 2,
            'type': 1,
            'notes': 'i wanna flag this question',
            'raisedBy': {
              'userId': 6,
              'firstName': 'Kristin',
              'lastName': 'Muterspaw'
            },
            'raisedAt': '2018-03-21T13:21:33.8213611'
          },
          'comment': '',
          'codedAnswers': [
            {
              'id': 1,
              'schemeAnswerId': 1,
              'pincite': 'pincite for me',
              'textAnswer': null
            }
          ]
        }
      ]
    }
  ],
  2: [
    {
      coder: { userId: 6, firstName: 'Kristin', lastName: 'Muterspaw' },
      codedQuestions: [
        {
          'id': 2,
          'schemeQuestionId': 2,
          'flag': {
            'id': 3,
            'type': 1,
            'notes': 'flag!!!!',
            'raisedBy': {
              'userId': 6,
              'firstName': 'Kristin',
              'lastName': 'Muterspaw'
            },
            'raisedAt': '2018-03-21T13:21:42.0565986'
          },
          'comment': '',
          'codedAnswers': [
            {
              'id': 2,
              'schemeAnswerId': 4,
              'pincite': '',
              'textAnswer': null
            },
            {
              'id': 3,
              'schemeAnswerId': 6,
              'pincite': '',
              'textAnswer': null
            },
            {
              'id': 4,
              'schemeAnswerId': 5,
              'pincite': '',
              'textAnswer': null
            },
            {
              'id': 5,
              'schemeAnswerId': 3,
              'pincite': '',
              'textAnswer': null
            }
          ]
        }
      ]
    },
    {
      coder: { userId: 1, firstName: 'Admin', lastName: '' },
      codedQuestions: [
        {
          'id': 10020,
          'schemeQuestionId': 2,
          'flag': null,
          'comment': '',
          'codedAnswers': [
            {
              'id': 10011,
              'schemeAnswerId': 3,
              'pincite': '',
              'textAnswer': null
            },
            {
              'id': 10012,
              'schemeAnswerId': 6,
              'pincite': '',
              'textAnswer': null
            },
            {
              'id': 10013,
              'schemeAnswerId': 5,
              'pincite': '',
              'textAnswer': null
            }
          ]
        }
      ]
    }
  ],
  3:
    [
      {
        coder: { userId: 1, firstName: 'Admin', lastName: '' },
        codedQuestions: [
          {
            categoryId: 3,
            'id': 10021,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10014,
                'schemeAnswerId': 7,
                'pincite': 'hi',
                'textAnswer': 'admin answer!!'
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 10022,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10015,
                'schemeAnswerId': 7,
                'pincite': 'boop pincite boop',
                'textAnswer': 'boop'
              }
            ]
          },
          {
            'categoryId': 6,
            'id': 10023,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10016,
                'schemeAnswerId': 7,
                'pincite': '',
                'textAnswer': 'rewr'
              }
            ]
          }
        ]
      },
      {
        coder: { userId: 6, firstName: 'Kristin', lastName: 'Muterspaw' },
        codedQuestions: [
          {
            'categoryId': 3,
            'id': 3,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 6,
                'schemeAnswerId': 7,
                'pincite': 'pincite 4 dayz',
                'textAnswer': 'hi from me@@@!#!@#@!'
              }
            ]
          },
          {
            'categoryId': 4,
            'id': 4,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 7,
                'schemeAnswerId': 7,
                'pincite': 'pincite 4 dayz',
                'textAnswer': 'hi from me@@@!#!@#@!'
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 5,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 8,
                'schemeAnswerId': 7,
                'pincite': 'pincite 4 dayz',
                'textAnswer': 'hi from me@@@!#!@#@!'
              }
            ]
          },
          {
            'categoryId': 6,
            'id': 6,
            'schemeQuestionId': 3,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 9,
                'schemeAnswerId': 7,
                'pincite': 'pincite 4 dayz',
                'textAnswer': 'hi from me@@@!#!@#@!'
              }
            ]
          }
        ]
      }
    ],
  4:
    [
      {
        coder: { userId: 6, firstName: 'Kristin', lastName: 'Muterspaw' },
        codedQuestions: [
          {
            'categoryId': 3,
            'id': 10002,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': []
          },
          {
            'categoryId': 4,
            'id': 10003,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10002,
                'schemeAnswerId': 8,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 10004,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': []
          },
          {
            'categoryId': 6,
            'id': 10005,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': []
          }
        ]
      },
      {
        coder: { userId: 1, firstName: 'Admin', lastName: '' },
        codedQuestions: [
          {
            'categoryId': 3,
            'id': 10024,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10017,
                'schemeAnswerId': 9,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 10025,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10018,
                'schemeAnswerId': 9,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 6,
            'id': 10026,
            'schemeQuestionId': 4,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10019,
                'schemeAnswerId': 9,
                'pincite': '',
                'textAnswer': null
              }
            ]
          }
        ]
      }
    ],
  5:
    [
      {
        coder: { userId: 1, firstName: 'Admin', lastName: '' },
        codedQuestions: [
          {
            'categoryId': 3,
            'id': 10027,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10020,
                'schemeAnswerId': 13,
                'pincite': '',
                'textAnswer': null
              },
              {
                'id': 10021,
                'schemeAnswerId': 11,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 10028,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10022,
                'schemeAnswerId': 13,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 6,
            'id': 10029,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10023,
                'schemeAnswerId': 11,
                'pincite': '',
                'textAnswer': null
              }
            ]
          }
        ]
      },
      {
        coder: { userId: 6, firstName: 'Kristin', lastName: 'Muterspaw' },
        codedQuestions: [
          {
            'categoryId': 3,
            'id': 10006,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10005,
                'schemeAnswerId': 13,
                'pincite': '',
                'textAnswer': null
              },
              {
                'id': 10006,
                'schemeAnswerId': 12,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 4,
            'id': 10007,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10007,
                'schemeAnswerId': 14,
                'pincite': '',
                'textAnswer': null
              },
              {
                'id': 10008,
                'schemeAnswerId': 13,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 5,
            'id': 10008,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10003,
                'schemeAnswerId': 11,
                'pincite': '',
                'textAnswer': null
              },
              {
                'id': 10004,
                'schemeAnswerId': 12,
                'pincite': '',
                'textAnswer': null
              }
            ]
          },
          {
            'categoryId': 6,
            'id': 10009,
            'schemeQuestionId': 5,
            'flag': null,
            'comment': '',
            'codedAnswers': [
              {
                'id': 10009,
                'schemeAnswerId': 13,
                'pincite': '',
                'textAnswer': null
              }
            ]
          }
        ]
      }
    ]
}

export const api = axios.create({
  baseURL: '/api'
})

export default {
  // Login a user, called in Login/logic
  login(user) {
    return api.post('/users/authenticate', user).then(res => {
      login(res.data.token.value)
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
    return api.get('/users').then(res => res.data.users)
  },

  // Add a user, called in Admin/scenes/AddEditUser/logic
  addUser(user) {
    return api.post('/users', user).then(res => res.data.newUser)
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
  getUserBookmarks(id) {
    return api.get(`/users/${id}/bookmarkedprojects`).then(res => res.data)
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
    return api.post(`/projects/${projectId}/jurisdictions/${jurisdiction.id}`, jurisdiction).then(res => res.data)
  },

  // Update a jurisdiction on a project, called in Home/scenes/AddEditJurisdictions/logic
  updateJurisdictionInProject(projectId, jurisdiction) {
    return api.put(`/projects/${projectId}/jurisdictions/${jurisdiction.id}`, jurisdiction).then(res => res.data)
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

  // Get a project's coding scheme, called in CodingScheme/logic, Coding/Logic, Validation/logic
  getScheme(projectId) {
    return api.get(`/projects/${projectId}/scheme`).then(res => res.data)
  },

  // Get a scheme question, called in Coding/logic, Validation/logic
  getSchemeQuestion(questionId, projectId) {
    return api.get(`/projects/${projectId}/scheme/${questionId}`).then(res => res.data)
  },

  // Create an empty coded question object, called in Coding/logic, Validation/logic
  createEmptyCodedQuestion({ questionId, projectId, jurisdictionId, userId, questionObj }) {
    return api.post(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`, { ...questionObj })
      .then(res => res.data)
  },

  // Answer a question for a user (creates a coded question), jurisdiction and project, called in Coding/logic
  answerQuestion(projectId, jurisdictionId, userId, questionId, updatedQuestion) {
    return api.put(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`, updatedQuestion)
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

  // Gets user coded questions for a project and jurisdiction, called in Coding/logic
  getUserCodedQuestions(userId, projectId, jurisdictionId) {
    return api.get(`/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions`)
      .then(res => res.data)
  },

  // Gets all validates questions for a jurisdiction and project, called in Validation/logic
  getValidatedQuestions(projectId, jurisdictionId) {
    return api.get(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions`).then(res => res.data)
  },

  // Create an empty validated question, called in Validation/logic
  createEmptyValidatedQuestion({ projectId, jurisdictionId, questionId, userId, questionObj }) {
    return api.post(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`, {
      ...questionObj,
      validatedBy: userId
    }).then(res => res.data)
  },

  // Validates a question for a jurisdiction and project, called in Validation/logic
  validateQuestion(projectId, jurisdictionId, questionId, updatedQuestion) {
    return api.put(`/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`, updatedQuestion)
      .then(res => res.data)
  },

  // Get all coded questions for a specific question
  getAllCodedQuestionsForQuestion(projectId, jurisdictionId, questionId) {
    return mockAllCodedQuestions[questionId]
    //return api.get(`/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`).then(res => res.data)
  },

  // Gets a list of all the coders for a project, called in Validation/logic
  getProjectCoders(projectId) {
    return api.get(`/projects/${projectId}/coders`).then(res => res.data)
  },

  // Gets a picture for user, called in Admin/scenes/AddEditUser/logic, Validation/logic
  getUserPicture(userId) {
    return api.get(`/users/${userId}/avatar`).then(res => {
      return res.status !== 204
    }).catch(error => {
      return false
    })
  },

  // Gets the protocol for a project, called in Protocol/logic
  getProtocol(projectId) {
    return api.get(`/projects/${projectId}/protocol`).then(res => res.data.text)
  },

  // Saves the protocol for a project, called in Protocol/logic
  saveProtocol(projectId, userId, protocol) {
    return api.put(`/projects/${projectId}/protocol`, { userId, text: protocol }).then(res => res.data)
  }
}
