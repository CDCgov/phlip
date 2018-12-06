import { createLogic } from 'redux-logic'
import PropTypes from 'prop-types'
import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'

const getDocumentContentsLogic = createLogic({
  type: types.GET_DOCUMENT_CONTENTS_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    try {
      const { content } = await docApi.getDocumentContents({}, {}, { docId: action.id })
      dispatch({
        type: types.GET_DOCUMENT_CONTENTS_SUCCESS,
        payload: content
      })
    } catch (err) {
      dispatch({
        type: types.GET_DOCUMENT_CONTENTS_FAIL,
        payload: 'Failed to get doc contents'
      })
    }
    done()
  }
})

const updateDocLogic = createLogic({
  type: types.UPDATE_DOC_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    let fd = { files: [] }, md = {}
    const selectedDoc = getState().scenes.docView.document
    const { content, ...otherProps } = selectedDoc

    md.status = selectedDoc.status
    md.effectiveDate = selectedDoc.effectiveDate !== undefined
      ? selectedDoc.effectiveDate
      : ''
    md.citation = selectedDoc.citation
    md.jurisdictions = selectedDoc.jurisdictions
    md.projects = selectedDoc.projects

    try {
      const updatedDoc = await docApi.updateDoc({
        'metadata': JSON.stringify(md),
        'docId': selectedDoc._id
      }, {}, {})

      if (action.property !== null && action.property === 'jurisdictions') {
        dispatch({
          type: jurisdictionTypes.ADD_JURISDICTION,
          payload: action.value
        })
      }

      if (action.property !== null && action.property === 'projects') {
        dispatch({
          type: projectTypes.ADD_PROJECT,
          payload: action.value
        })
      }

      dispatch({
        type: types.UPDATE_DOC_SUCCESS,
        payload: updatedDoc._id
      })
      done()
    } catch (err) {
      console.log(err)
      dispatch({
        type: types.UPDATE_DOC_FAIL,
        payload: { error: 'Failed to update documents, please try again.' }
      })
      done()
    }
  }
})

export default [
  getDocumentContentsLogic, updateDocLogic
]
