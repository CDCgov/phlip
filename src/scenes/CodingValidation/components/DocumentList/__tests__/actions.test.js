import actions, { types } from '../actions'

describe('CodingValidation - DocumentList action creators', () => {
  test('should create an action to get approved documents', () => {
    const expectedAction = {
      type: types.GET_APPROVED_DOCUMENTS_REQUEST,
      projectId: 1,
      jurisdictionId: 32,
      page: 'coding'
    }

    expect(actions.getApprovedDocumentsRequest(1,32,'coding')).toEqual(expectedAction)
  })

  test('should create an action to clear selected / enabled document', () => {
    const expectedAction = {
      type: types.CLEAR_DOC_SELECTED
    }

    expect(actions.clearDocSelected()).toEqual(expectedAction)
  })

  test('should create an action to get document contents', () => {
    const expectedAction = {
      type: types.GET_DOC_CONTENTS_REQUEST,
      id: 123123
    }

    expect(actions.getDocumentContentsRequest(123123)).toEqual(expectedAction)
  })
})