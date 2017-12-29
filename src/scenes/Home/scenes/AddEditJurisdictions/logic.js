import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { updater } from 'utils'

const addProjectJurisdiction = createLogic({
  type: types.ADD_PROJECT_JURISDICTION,
  transform({ getState, action }, next) {
    const project = {
      ...action.project,
      jurisdictions: [ action.jurisdiction, ...action.project.jurisdictions ]
    }

    console.log(project)
    next({
      ...action,
      project
    })
  }
})

const updateProjectJurisdiction = createLogic({
  type: types.UPDATE_PROJECT_JURISDICTION,
  transform({ action }, next) {
    const project = {
      ...action.project,
      jurisdictions: updater.updateByProperty(action.jurisdiction, action.projects.jurisdictions, 'id')
    }

    next({
      ...action,
      project
    })
  }
})

export default [updateProjectJurisdiction, addProjectJurisdiction]