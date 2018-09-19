import actions, { types } from '../actions'

describe('Document management - Upload action creators', () => {
  test('should create an action to upload documents', () => {
    const expectedAction = {
      type: types.UPLOAD_DOCUMENTS_REQUEST,
      selectedDocs: [{ name: 'blah' }]
    }
    expect(actions.uploadDocumentsRequest([{ name: 'blah' }])).toEqual(expectedAction)
  })

  test('should create an action to verify selected documents to upload', () => {
    const expectedAction = {
      type: types.VERIFY_UPLOAD_REQUEST,
      selectedDocs: [{ name: 'blah' }]
    }

    expect(actions.verifyUploadRequest([{ name: 'blah' }])).toEqual(expectedAction)
  })

  test('should create an action to update a document property', () => {
    const expectedAction = {
      type: types.UPDATE_DOC_PROPERTY,
      index: 1,
      property: 'name',
      value: 'newName.doc'
    }

    expect(actions.updateDocumentProperty(1, 'name', 'newName.doc')).toEqual(expectedAction)
  })

  test('should create an action to add documents to the selected list', () => {
    const expectedAction = {
      type: types.ADD_SELECTED_DOCS,
      selectedDocs: [{ name: 'doc1' }, { name: 'doc2' }]
    }

    expect(actions.addSelectedDocs([{ name: 'doc1' }, { name: 'doc2' }])).toEqual(expectedAction)
  })

  test('should create an action to clear selected files list', () => {
    const expectedAction = {
      type: types.CLEAR_SELECTED_FILES
    }

    expect(actions.clearSelectedFiles()).toEqual(expectedAction)
  })

  test('should create an action to remove a doc from the selected list', () => {
    const expectedAction = {
      type: types.REMOVE_DOC,
      index: 1
    }

    expect(actions.removeDoc(1)).toEqual(expectedAction)
  })

  test('should create an action to remove a tag from a doc', () => {
    const expectedAction = {
      type: types.REMOVE_TAG,
      index: 1,
      tag: 'cool tag',
      tagIndex: 4
    }

    expect(actions.removeTag(1, 'cool tag', 4)).toEqual(expectedAction)
  })

  test('should create an action to add a tag to a doc', () => {
    const expectedAction = {
      type: types.ADD_TAG,
      index: 1,
      tag: 'new cool tag'
    }

    expect(actions.addTag(1, 'new cool tag')).toEqual(expectedAction)
  })

  test('should create an action to close the alert', () => {
    const expectedAction = {
      type: types.CLOSE_ALERT
    }

    expect(actions.closeAlert()).toEqual(expectedAction)
  })

  test('should create an action to open alert with text', () => {
    const expectedAction = {
      type: types.OPEN_ALERT,
      text: 'alert text'
    }

    expect(actions.openAlert('alert text')).toEqual(expectedAction)
  })
})