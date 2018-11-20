import actions, { types } from '../actions'

describe('DocumentView action creators', () => {
  test('should create an action to init state', () => {
    const expectedAction = {
      type: types.INIT_STATE_WITH_DOC,
      doc: {
        name: 'test doc'
      }
    }
    expect(actions.initState({ name: 'test doc' })).toEqual(expectedAction)
  })

  test('should create an action to get document contents', () => {
    const expectedAction = {
      type: types.GET_DOCUMENT_CONTENTS_REQUEST,
      id: '1212'
    }

    expect(actions.getDocumentContentsRequest('1212')).toEqual(expectedAction)
  })
})
