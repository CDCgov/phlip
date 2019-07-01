import { types } from '../actions'
import reducer, { INITIAL_STATE } from '../reducer'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('Home scene - AddEditProject reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  describe('ADD_PROJECT_REQUEST', () => {
    const project = { id: 1, name: 'New Project' }
    const currentState = getState()
    const action = { type: types.ADD_PROJECT_REQUEST, project }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('UPDATE_PROJECT_REQUEST', () => {
    const project = { id: 1, name: 'Updated Project' }
    const currentState = getState()
    const action = { type: types.UPDATE_PROJECT_REQUEST, project }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('DELETE_PROJECT_REQUEST', () => {
    const project = { id: 1, name: 'Project To Delete' }
    const currentState = getState()
    const action = { type: types.DELETE_PROJECT_REQUEST, project }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('ADD_PROJECT_SUCCESS', () => {
    const project = { id: 1, name: 'New Project' }
    const currentState = getState({ submitting: true })
    const action = { type: types.ADD_PROJECT_SUCCESS, project }
    const state = reducer(currentState, action)
    
    test('should set go back to true', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('UPDATE_PROJECT_SUCCESS', () => {
    const project = { id: 1, name: 'Updated Project' }
    const currentState = getState({ submitting: true })
    const action = { type: types.UPDATE_PROJECT_SUCCESS, project }
    const state = reducer(currentState, action)
    
    test('should set go back to true', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('DELETE_PROJECT_SUCCESS', () => {
    const project = { id: 1, name: 'Project to delete' }
    const currentState = getState({ submitting: true })
    const action = { type: types.DELETE_PROJECT_SUCCESS, project }
    const state = reducer(currentState, action)
    
    test('should set go back to true', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('ADD_PROJECT_FAIL', () => {
    const currentState = getState({ submitting: true })
    const action = { type: types.ADD_PROJECT_FAIL, payload: 'failed to add project' }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set form error to the request error', () => {
      expect(state.formError).toEqual('failed to add project')
    })
  })
  
  describe('UPDATE_PROJECT_FAIL', () => {
    const currentState = getState({ submitting: true })
    const action = { type: types.UPDATE_PROJECT_FAIL, payload: 'failed to update project' }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set form error to the request error', () => {
      expect(state.formError).toEqual('failed to update project')
    })
  })
  
  describe('DELETE_PROJECT_FAIL', () => {
    const currentState = getState({ submitting: true })
    const action = { type: types.DELETE_PROJECT_FAIL, payload: 'failed to delete project' }
    const state = reducer(currentState, action)
    
    test('should set go back to false', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set form error to the request error', () => {
      expect(state.formError).toEqual('failed to delete project')
    })
  })
  
  describe('SET_CURRENT_USERS', () => {
    const action = {
      type: types.SET_CURRENT_USERS,
      users: [{ userId: 42 }, { userId: 4 }, { userId: 10 }],
      creatorId: 4
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should put creator user at end of list', () => {
      expect(state.users).toEqual([{ userId: 42 }, { userId: 10 }, { userId: 4 }])
    })
  })
  
  describe('ON_USER_SUGGESTION_SELECTED', () => {
    const action = {
      type: types.ON_USER_SUGGESTION_SELECTED,
      user: { id: 22 }
    }
    
    const currentState = getState({ users: [{ userId: 42 }, { userId: 10 }, { userId: 4 }] })
    const state = reducer(currentState, action)
    
    test('should add user to top of list', () => {
      expect(state.users[0]).toEqual({ userId: 22, id: 22 })
    })
    
    test('should set userId', () => {
      expect(state.users[0].hasOwnProperty('userId')).toEqual(true)
      expect(state.users[0].userId).toEqual(22)
    })
    
    test('should not overwrite existing users', () => {
      expect(state.users.length).toEqual(4)
    })
    
    test('should clear search string', () => {
      expect(state.userSearchValue).toEqual('')
    })
  })
  
  describe('REMOVE_USER_FROM_LIST', () => {
    const action = {
      type: types.REMOVE_USER_FROM_LIST,
      index: 2
    }
    
    const currentState = getState({ users: [{ userId: 42 }, { userId: 10 }, { userId: 4 }] })
    const state = reducer(currentState, action)
    
    test('should remove the user from the list', () => {
      expect(state.users.find(user => user.userId === 4)).toEqual(undefined)
    })
    
    test('should not remove any other users', () => {
      expect(state.users.length).toEqual(2)
    })
  })
  
  describe('UPDATE_USER_SUGGESTION_VALUE', () => {
    const action = {
      type: types.UPDATE_USER_SUGGESTION_VALUE,
      suggestionValue: 'krist'
    }
  
    const currentState = getState({ userSearchValue: 'search' })
    const state = reducer(currentState, action)
    
    test('should update value', () => {
      expect(state.userSearchValue).toEqual('krist')
    })
  })
  
  describe('SET_USER_SUGGESTIONS', () => {
    const action = {
      type: types.SET_USER_SUGGESTIONS,
      payload: [{ id: 10 }, { id: 22 }, { id: 43 }]
    }
    
    test('should set suggestions', () => {
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.userSuggestions).toEqual([{ id: 10 }, { id: 22 }, { id: 43 }])
    })
    
    test('should filter out existing users', () => {
      const currentState = getState({ users: [{ userId: 43 }, { userId: 22 }] })
      const state = reducer(currentState, action)
      expect(state.userSuggestions).toEqual([{ id: 10 }])
    })
  })
  
  describe('ON_CLEAR_USER_SUGGESTIONS', () => {
    const action = { type: types.ON_CLEAR_USER_SUGGESTIONS }
    const currentState = getState({ userSuggestions: [{ userId: 43 }, { userId: 22 }] })
    const state = reducer(currentState, action)
    
    test('should remove all user suggestions', () => {
      expect(state.userSuggestions).toEqual([])
    })
  })
  
  describe('RESET_FORM_ERROR', () => {
    test('should reset form error', () => {
      const currentState = getState({ formError: 'blep' })
      const action = { type: types.RESET_FORM_ERROR }
      const state = reducer(currentState, action)
      expect(state.formError).toEqual(null)
    })
  })
})
