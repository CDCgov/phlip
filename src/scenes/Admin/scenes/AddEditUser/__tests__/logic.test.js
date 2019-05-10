import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

const mockReducer = (state, action) => state
const history = {}
const api = createApiHandler({ history }, projectApiInstance, calls)

const setupStore = (state = {}) => {
  return createMockStore({
    initialState: state,
    reducer: mockReducer,
    logic,
    injectedDeps: {
      api
    }
  })
}

describe('Admin - AddEditUser Logic', () => {
  let mock
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  describe('Adding a user', () => {
    test('should call add user api to add a user', done => {
      const spy = jest.spyOn(api, 'addUser')
      mock.onPost('/users').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should dispatch success when adding is successful', done => {
      mock.onPost('/users').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      store.whenComplete(() => {
        expect(store.actions[1])
          .toEqual({ type: types.ADD_USER_SUCCESS, payload: { id: 1, firstName: 'new', lastName: 'user' } })
        done()
      })
    })
    
    test('should dispatch failure when adding fails', done => {
      mock.onPost('/users').reply(500)
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_USER_FAIL)
        done()
      })
    })
  })
})
