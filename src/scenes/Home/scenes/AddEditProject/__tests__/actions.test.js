import * as actions from '../actions'
import * as types from '../../../actionTypes'

describe('Home scene - Add Edit Project actions creators', () => {
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

  test('should create an action to update a project', () => {
    const updatedProject = { name: 'new name' }
    const expectedAction = {
      type: types.UPDATE_PROJECT_REQUEST,
      project: updatedProject
    }

    expect(actions.updateProjectRequest(updatedProject)).toEqual(expectedAction)
  })

  test('should create an action to indicate updating project was successfully', () => {
    const payload = { name: 'Project 1' }
    const expectedAction = {
      type: types.UPDATE_PROJECT_SUCCESS,
      payload
    }

    expect(actions.updateProjectSuccess(payload)).toEqual(expectedAction)
  })

  test('should create an action to indicate updating a project failed', () => {
    const payload = 'errorValue'
    const expectedAction = {
      type: types.UPDATE_PROJECT_FAIL,
      errorValue: payload,
      error: true
    }

    expect(actions.updateProjectFail(payload)).toEqual(expectedAction)
  })
})