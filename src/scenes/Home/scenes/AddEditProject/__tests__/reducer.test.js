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
  
  describe('RESET_FORM_ERROR', () => {
    test('should reset form error', () => {
      const currentState = getState({ formError: 'blep' })
      const action = { type: types.RESET_FORM_ERROR }
      const state = reducer(currentState, action)
      expect(state.formError).toEqual(null)
    })
  })
})
