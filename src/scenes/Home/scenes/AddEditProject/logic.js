import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'

export const addProjectLogic = createLogic({
  type: types.ADD_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const project = await api.addProject(action.project)
      dispatch({
        type: types.ADD_PROJECT_SUCCESS,
        payload: {
          ...project
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PROJECT_FAIL,
        payload: 'We couldn\'t add this project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export const updateProjectLogic = createLogic({
  type: types.UPDATE_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const updatedProject = await api.updateProject(action.project)
      dispatch({
        type: types.UPDATE_PROJECT_SUCCESS,
        payload: {
          ...updatedProject
        }
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_PROJECT_FAIL,
        payload: 'We couldn\'t update this project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export const updateUserId = createLogic({
  type: [types.ADD_PROJECT_REQUEST, types.UPDATE_PROJECT_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      project: { ...action.project, userId: getState().data.user.currentUser.id }
    })
  }
})

export default [
  updateUserId,
  addProjectLogic,
  updateProjectLogic
]