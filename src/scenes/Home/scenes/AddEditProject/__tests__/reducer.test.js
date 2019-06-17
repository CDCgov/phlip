import { types } from '../../../actions'
import reducer from '../reducer'

describe('Home scene - AddEditProject reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ goBack: false, formError: null })
  })
  
  describe('ADD_PROJECT_REQUEST', () => {
    test('should set go back to false', () => {
      const project = { id: 1, name: 'New Project' }
      expect(reducer({}, {
        type: types.ADD_PROJECT_REQUEST,
        project: project.id
      }).goBack).toEqual(false)
    })
  })
  
  describe('UPDATE_PROJECT_REQUEST', () => {
    test('should set go back to false', () => {
      const project = { id: 1, name: 'New Project' }
      expect(reducer({}, {
        type: types.UPDATE_PROJECT_REQUEST,
        project: project.id
      }).goBack).toEqual(false)
    })
  })
  
  describe('DELETE_PROJECT_REQUEST', () => {
    test('should set go back to false', () => {
      const project = { id: 1, name: 'New Project' }
      expect(reducer({}, {
        type: types.DELETE_PROJECT_REQUEST,
        project: project.id
      }).goBack).toEqual(false)
    })
  })
  
  describe('UPDATE_PROJECT_FAIL', () => {
    test('should set the form error to action.payload', () => {
      expect(reducer({}, {
        type: types.UPDATE_PROJECT_FAIL,
        payload: 'Failed to update project'
      }).formError).toEqual('Failed to update project')
    })
  })
})
