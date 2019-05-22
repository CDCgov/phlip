import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../../../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { projects } from 'utils/testData/projectsHome'
import { types as projectTypes } from 'data/projects/actions'

describe('Home scene - AddEditProject logic', () => {
  let mock
  
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)
  const mockReducer = (state, action) => state
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = initialBookmarks => {
    return createMockStore({
      initialState: {
        data: {
          user: {
            currentUser: {
              id: 5,
              bookmarks: initialBookmarks,
              firstName: 'Test',
              lastName: 'User'
            }
          },
          projects: {
            byId: projects
          }
        }
      },
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api
      }
    })
  }
  
  describe('Adding a project', () => {
    const project = {
      id: 12345,
      name: 'New Project',
      isCompleted: false,
      lastEditedBy: 'Test User'
    }
    
    let store
    beforeEach(() => {
      mock.onPost('/projects').reply(200, project)
      store = setupStore()
      store.dispatch({ type: types.ADD_PROJECT_REQUEST, project })
    })
    
    test('should post a new project and dispatch ADD_PROJECT_SUCCESS when successful', done => {
      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({ type: types.ADD_PROJECT_SUCCESS })
        done()
      })
    })
    
    test('should add the project to global projects', done => {
      store.whenComplete(() => {
        expect(store.actions[2]).toEqual({
          type: projectTypes.ADD_PROJECT, payload: { ...project, lastUsersCheck: null }
        })
        done()
      })
    })
    
    test('should update visible projects', done => {
      store.whenComplete(() => {
        expect(store.actions[3]).toEqual({
          type: types.UPDATE_VISIBLE_PROJECTS, payload: {}
        })
        done()
      })
    })
  })
  
  describe('Updating a project', () => {
    const project = { id: 1, name: 'Updated Project', lastEditedBy: 'Test User' }
  
    let store
    beforeEach(() => {
      mock.onPut('/projects/1').reply(200, project)
      store = setupStore([])
      store.dispatch({ type: types.UPDATE_PROJECT_REQUEST, project: { ...project, userId: 5 } })
    })
    
    test('should put an updated project and dispatch UPDATE_PROJECT_SUCCESS when successful', done => {
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual('UPDATE_PROJECT_SUCCESS')
        done()
      })
    })
    
    test('should update the project at the global level', done => {
      store.whenComplete(() => {
        expect(store.actions[2]).toEqual({ type: projectTypes.UPDATE_PROJECT, payload: project })
        done()
      })
    })
    
    test('should update visible projects', done => {
      store.whenComplete(() => {
        expect(store.actions[3]).toEqual({
          type: types.UPDATE_VISIBLE_PROJECTS, payload: {}
        })
        done()
      })
    })
  })
  
  describe('Deleting a project', () => {
    test('should delete a project and dispatch DELETE_PROJECT_SUCCESS when successful', done => {
      const project = { id: 1, name: 'Delete Project', lastEditedBy: 'Test User' }
      const store = setupStore([])
      
      mock.onDelete('/projects/1').reply(200, project)
      store.dispatch({
        type: types.DELETE_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual('DELETE_PROJECT_SUCCESS')
        expect(store.actions[1].project).toEqual(1)
        done()
      })
    })
  })
})
