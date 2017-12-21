import * as actions from '../actions'
import * as types from '../../../actionTypes'

describe('Home scene - New Project actions creators', () => {
  test('should create an action to add a project', () => {
    const project = { name: 'New Project' }
    const expectedAction = {
      type: types.ADD_PROJECT_REQUEST,
      project
    }

    expect(actions.addProjectRequest(project)).toEqual(expectedAction)
  })

  test('should create an action indicating add project was successful', () => {
    const payload = { name: 'New Project' }
    const expectedAction = {
      type: types.ADD_PROJECT_SUCCESS,
      payload
    }

    expect(actions.addProjectSuccess(payload)).toEqual(expectedAction)
  })

  test('should create an action indicating add project failed', () => {
    const payload = 'error occurred'
    const expectedAction = {
      type: types.ADD_PROJECT_FAIL,
      error: true,
      errorValue: payload
    }

    expect(actions.addProjectFail(payload)).toEqual(expectedAction)
  })
})