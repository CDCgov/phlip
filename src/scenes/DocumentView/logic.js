import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as codingTypes } from 'scenes/CodingValidation/components/DocumentList/actions'
import { types as docManageTypes } from 'scenes/DocumentManagement/actions'

const getDocumentContentsLogic = createLogic({
  type: [types.GET_DOCUMENT_CONTENTS_REQUEST, codingTypes.GET_DOC_CONTENTS_REQUEST],
  async process({ getState, docApi, action }, dispatch, done) {
    try {
      const { content } = await docApi.getDocumentContents({}, {}, { docId: action.id })
      dispatch({
        type: action.type === types.GET_DOCUMENT_CONTENTS_REQUEST
          ? types.GET_DOCUMENT_CONTENTS_SUCCESS
          : codingTypes.GET_DOC_CONTENTS_SUCCESS,
        payload: content
      })
    } catch (err) {
      dispatch({
        type: action.type === types.GET_DOCUMENT_CONTENTS_REQUEST
          ? types.GET_DOCUMENT_CONTENTS_FAIL
          : codingTypes.GET_DOC_CONTENTS_FAIL,
        payload: 'Failed to get the contents of this document.'
      })
    }
    done()
  }
})

const updateDocLogic = createLogic({
  type: types.UPDATE_DOC_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    let md = {}
    const selectedDoc = getState().scenes.docView.documentForm
    
    md.status = selectedDoc.status
    md.effectiveDate = selectedDoc.effectiveDate !== undefined
      ? selectedDoc.effectiveDate
      : ''
    md.citation = selectedDoc.citation
    md.jurisdictions = selectedDoc.jurisdictions
    md.projects = selectedDoc.projects

    try {
      const updatedDoc = await docApi.updateDoc({ ...md }, {}, { docId: selectedDoc._id })
      
      if (['jurisdictions', 'projects'].includes(action.property)) {
        if (action.updateType === 'add') {
          dispatch({
            type: action.property === 'jurisdictions' ? jurisdictionTypes.ADD_JURISDICTION : projectTypes.ADD_PROJECT,
            payload: action.value
          })
        }
      }
      
      dispatch({
        type: types.UPDATE_DOC_SUCCESS,
        payload: updatedDoc._id
      })
      done()
    } catch (err) {
      dispatch({
        type: types.UPDATE_DOC_FAIL,
        error: action.property === 'projects' || action.property === 'jurisdictions'
          ? `Failed to ${action.updateType} the ${action.property.slice(0, -1)} ${action.updateType === 'add'
            ? 'to'
            : 'from'} the document.`
          : 'Failed to update the document.'
      })
      done()
    }
  }
})

const deleteDocLogic = createLogic({
  type: types.DELETE_DOCUMENT_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    try {
      await docApi.deleteDoc({}, {}, { 'docId': action.id })
      dispatch({
        type: types.DELETE_DOCUMENT_SUCCESS,
        payload: action.id
      })
      dispatch({
        type: docManageTypes.ON_DELETE_ONE_FILE,
        id: action.id
      })
      done()
    } catch (err) {
      dispatch({
        type: types.DELETE_DOCUMENT_FAIL,
        payload: { error: 'Failed to delete the document.' }
      })
      done()
    }
  }
})

export default [
  getDocumentContentsLogic, updateDocLogic, deleteDocLogic
]
