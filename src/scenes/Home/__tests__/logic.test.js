import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { INITIAL_STATE } from '../reducer'
import { types as projectTypes } from 'data/projects/actions'
import { projects, projectsPayload, sortedByDateAndBookmarked, defaultSorted } from 'utils/testData/projectsHome'

describe('Home logic', () => {
  let mock
  
  const mockReducer = (state, action) => state
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (initialBookmarks = {}, withProjects = true, homeState = {}) => {
    return createMockStore({
      initialState: {
        data: {
          projects: withProjects ? { byId: projects, allIds: defaultSorted } : { byId: {}, allIds: [] },
          user: { currentUser: { id: 5, bookmarks: initialBookmarks } }
        },
        scenes: {
          home: {
            main: {
              projects: { visible: [], matches: [] },
              ...INITIAL_STATE,
              ...homeState
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }
  
  describe('Updating visible projects by sorting, searching, etc.', () => {
    describe('SORT_PROJECTS', () => {
      describe('sort by: name ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true)
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [1,2,3,4,5]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([1, 2, 3, 4, 5])
            done()
          })
        })
        
        test('should set state.sortBy to name', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('name')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: name descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc' })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [5, 4, 3, 2, 1]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 3, 2, 1])
            done()
          })
        })
        
        test('should set state.sortBy to name', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('name')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
      
      describe('sort by: dateLastEdited ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'dateLastEdited' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [1, 3, 2, 4, 5]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([1, 3, 2, 4, 5])
            done()
          })
        })
        
        test('should set state.sortBy to dateLastEdited', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('dateLastEdited')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: dateLastEdited descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'dateLastEdited' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [5, 4, 2, 3, 1]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 2, 3, 1])
            done()
          })
        })
        
        test('should set state.sortBy to dateLastEdited', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('dateLastEdited')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
      
      describe('sort by: lastEditedBy ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'lastEditedBy' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [4, 5, 1, 2, 3]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([4, 5, 1, 2, 3])
            done()
          })
        })
        
        test('should set state.sortBy to lastEditedBy', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('lastEditedBy')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: lastEditedBy descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'lastEditedBy' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [3, 2, 1, 5, 4]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([3, 2, 1, 5, 4])
            done()
          })
        })
        
        test('should set state.sortBy to lastEditedBy', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('lastEditedBy')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
    })
  })
  
  describe('Getting Projects', () => {
    let store
    beforeEach(() => {
      mock.onGet('/projects').reply(200, projectsPayload)
      store = setupStore([1], true)
      store.dispatch({ type: types.GET_PROJECTS_REQUEST, payload: {} })
    })
    
    test('should get project list and set bookmarkList and dispatch GET_PROJECTS_SUCCESS when done', done => {
      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({ type: types.GET_PROJECTS_SUCCESS })
        done()
      })
    })
    
    test('should dispatch set projects to set globally and home state', done => {
      store.whenComplete(() => {
        expect(store.actions[2].type).toEqual(projectTypes.SET_PROJECTS)
        expect(store.actions[2].payload.data).toEqual({
          byId: projects,
          allIds: [1, 2, 3, 4, 5]
        })
        done()
      })
    })
    
    test('should sort by dateLastEdited and descending', done => {
      store.whenComplete(() => {
        expect(store.actions[2].type).toEqual(projectTypes.SET_PROJECTS)
        expect(store.actions[2].payload.projects).toEqual({
          visible: defaultSorted,
          matches: []
        })
        done()
      })
    })
  })
  
  describe('Toggling Bookmarks', () => {
    test(
      'should add the project id to bookmarkList if the id doesn\'t exist when TOGGLE_BOOKMARK is dispatched',
      done => {
        const project = { id: 1, name: 'Project 1' }
        const store = setupStore([])
        
        mock.onPost('/users/5/bookmarkedprojects/1').reply(200, [
          { projectId: 1, userId: 5 },
          { projectId: 2, userId: 5 }
        ])
        
        store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
        store.whenComplete(() => {
          expect(store.actions[1].payload.bookmarkList).toEqual([1])
          done()
        })
      }
    )
    
    test(
      'should remove the project id from the bookmarkList if the id exists when TOGGLE_BOOKMARK is dispatched',
      done => {
        const project = { id: 2, name: 'Project 2' }
        const store = setupStore([2, 1, 5])
        
        mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [
          { projectId: 1, userId: 5 },
          { projectId: 5, userId: 5 }
        ])
        
        store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
        store.whenComplete(() => {
          expect(store.actions[1].payload.bookmarkList).toEqual([1, 5])
          done()
        })
      }
    )
    
    test('should return bookmarkList as empty if length is 1 and project id is being un-bookmarked', done => {
      const project = { id: 2, name: 'Project 2' }
      mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [])
      const store = setupStore([2])
      
      store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
      store.whenComplete(() => {
        expect(store.actions[1].payload.bookmarkList).toEqual([])
        done()
      })
    })
  })
})
