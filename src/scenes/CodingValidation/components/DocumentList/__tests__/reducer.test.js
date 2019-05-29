import { types } from '../actions'
import reducer, { INITIAL_STATE } from '../reducer'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

const documentPayload = [
  {
    name: 'document 1',
    _id: '1234',
    uploadedDate: new Date('12/10/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  },
  {
    name: 'document 2',
    _id: '5678',
    uploadedDate: new Date('12/09/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  },
  {
    name: 'document 3',
    _id: '9101',
    uploadedDate: new Date('02/10/2018'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  }
]

const documents = {
  byId: {
    1234: { ...documentPayload[0], uploadedByName: 'test user' },
    5678: { ...documentPayload[1], uploadedByName: 'test user' },
    9101: { ...documentPayload[2], uploadedByName: 'test user' }
  },
  allIds: ['1234', '5678', '9101'],
  ordered: ['9101', '1234', '5678']
}

describe('CodingValidation - DocumentList reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  describe('GET_APPROVED_DOCUMENTS_REQUEST', () => {
    const action = {
      type: types.GET_APPROVED_DOCUMENTS_REQUEST
    }
    
    const state = reducer(getState(), action)
    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })
    
    test('should set state.enabledAnswerId to an empty string', () => {
      expect(state.enabledAnswerId).toEqual('')
    })
    
    test('should set state.annotationModeEnabled to false', () => {
      expect(state.annotationModeEnabled).toEqual(false)
    })
  })
  
  describe('GET_APPROVED_DOCUMENTS_SUCCESS', () => {
    const action = {
      type: types.GET_APPROVED_DOCUMENTS_SUCCESS,
      payload: documentPayload
    }
    
    describe('state.documents', () => {
      const state = reducer(getState(), action)
      
      test('should normalize action.payload into state.documents.byId', () => {
        expect(state.documents.byId).toEqual(documents.byId)
      })
      
      test('should put all ids into state.documents.allIds', () => {
        expect(state.documents.allIds).toEqual(documents.allIds)
      })
      
      test('should order documents by uploaded date', () => {
        expect(state.documents.ordered).toEqual(documents.ordered)
      })
    })
    
    describe('opened / selected document', () => {
      test('should clear state.docSelected if current doc selected _id is not in action.payload', () => {
        const state = reducer(getState({ docSelected: true, openedDoc: { _id: '4444' } }), action)
        expect(state.docSelected).toEqual(false)
        expect(state.openedDoc).toEqual({})
      })
      
      test('should keep state.docSelected and state.openedDoc if _id is in action.payload', () => {
        const state = reducer(getState({ docSelected: true, openedDoc: { _id: '9101', content: {} } }), action)
        expect(state.docSelected).toEqual(true)
        expect(state.openedDoc).toEqual({ _id: '9101', content: {} })
      })
    })
  })
  
  describe('GET_APPROVED_DOCUMENTS_FAIL', () => {
    const action = { type: types.GET_APPROVED_DOCUMENTS_FAIL }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.apiErrorInfo object', () => {
      expect(state.apiErrorInfo.text).toEqual('Failed to get the list of approved documents.')
      expect(state.apiErrorInfo.title).toEqual('Request failed')
    })
    
    test('should set state.apiErrorOpen to true', () => {
      expect(state.apiErrorOpen).toEqual(true)
    })
  })
  
  describe('GET_DOC_CONTENTS_REQUEST', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_REQUEST,
      id: '1234'
    }
    
    const currentState = getState({ documents })
    
    test('should set state.openedDoc', () => {
      const state = reducer(currentState, action)
      expect(state.openedDoc).toEqual({
        _id: '1234',
        name: 'document 1'
      })
    })
  })
  
  describe('GET_DOC_CONTENTS_SUCCESS', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_SUCCESS,
      payload: { data: {} }
    }
    
    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
    const state = reducer(currentState, action)
    
    test('should set state.docSelected to true', () => {
      expect(state.docSelected).toEqual(true)
    })
    
    test('should add action.payload to state.openedDoc.content', () => {
      expect(state.openedDoc).toEqual({
        _id: '1234',
        name: 'document 1',
        content: { data: {} }
      })
    })
  })
  
  describe('GET_DOC_CONTENTS_FAIL', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_FAIL
    }
    
    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
    const state = reducer(currentState, action)
    
    test('should set state.docSelected to true', () => {
      expect(state.docSelected).toEqual(true)
    })
    
    test('should set state.apiErrorInfo', () => {
      expect(state.apiErrorInfo.title).toEqual('')
      expect(state.apiErrorInfo.text).toEqual('Failed to retrieve document contents.')
    })
    
    test('should set state.apiErrorOpen to true', () => {
      expect(state.apiErrorOpen).toEqual(true)
    })
  })
  
  describe('CLEAR_DOC_SELECTED', () => {
    const action = { type: types.CLEAR_DOC_SELECTED }
    const currentState = getState({
      documents,
      openedDoc: { _id: '1234', name: 'document 1' },
      apiErrorInfo: { title: 'title', text: 'text' },
      apiErrorOpen: true
    })
    const state = reducer(currentState, action)
    
    test('should clear state.openedDoc', () => {
      expect(state.openedDoc).toEqual({})
    })
    
    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })
    
    test('should clear state.apiErrorInfo', () => {
      expect(state.apiErrorInfo.text).toEqual('')
      expect(state.apiErrorInfo.title).toEqual('')
    })
    
    test('should set state.apiErrorOpen to false', () => {
      expect(state.apiErrorOpen).toEqual(false)
    })
  })
  
  describe('TOGGLE_ANNOTATION_MODE', () => {
    describe('action.enabled === true', () => {
      const action = { type: types.TOGGLE_ANNOTATION_MODE, enabled: true, answerId: 4, questionId: 3 }
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should set state.enabledAnswerId to action.answerId', () => {
        expect(state.enabledAnswerId).toEqual(4)
      })
      
      test('should set state.annotationModeEnabled to true', () => {
        expect(state.annotationModeEnabled).toEqual(true)
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
    })
    
    describe('action.enabled === false', () => {
      const action = { type: types.TOGGLE_ANNOTATION_MODE, enabled: false, answerId: 4, questionId: 3 }
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })
      
      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })
      
      test('should set state.annotations to an empty array', () => {
        expect(state.annotations).toEqual([])
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
    })
  })
  
  describe('TOGGLE_CODER_ANNOTATIONS', () => {
    describe('when toggling on annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        isUserAnswerSelected: true,
        annotations: ['lalalala']
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should set state.enabledAnswerId to action.answerId', () => {
        expect(state.enabledAnswerId).toEqual(4)
      })
      
      test('should set whether the current user or validator answer is selected ', () => {
        expect(state.isUserAnswerSelected).toEqual(true)
      })
      
      test('should set state.enabledUserId to action.enabledUserId', () => {
        expect(state.enabledUserId).toEqual(1)
      })
      
      test('should set state.annotations to action.annotations', () => {
        expect(state.annotations).toEqual(['lalalala'])
      })
    })
    
    describe('when toggling off annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        isUserAnswerSelected: true,
        annotations: ['lalalala']
      }
      
      const currentState = getState({ enabledAnswerId: 4, enabledUserId: 1, isUserAnswerSelected: true })
      const state = reducer(currentState, action)
      
      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })
      
      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })
      
      test('should set state.annotations to an empty array', () => {
        expect(state.annotations).toEqual([])
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
    })
  })
  
  describe('HIDE_ANNO_MODE_ALERT', () => {
    const action = { type: types.HIDE_ANNO_MODE_ALERT }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.shouldShowAnnoModeAlert to false', () => {
      expect(state.shouldShowAnnoModeAlert).toEqual(false)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('shdould set state to initial state', () => {
      const action = { type: types.FLUSH_STATE }
      const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
      const state = reducer(currentState, action)
      expect(state).toEqual(INITIAL_STATE)
    })
    
    test('should not overwrite state.shouldShowAnnoModeAlert if action.isLogout is false or does not exist', () => {
      const action = { type: types.FLUSH_STATE }
      const currentState = getState({
        documents,
        openedDoc: { _id: '1234', name: 'document 1' },
        shouldShowAnnoModeAlert: false
      })
      const state = reducer(currentState, action)
      expect(state.shouldShowAnnoModeAlert).toEqual(false)
    })
    
    test('should overwrite state.shouldShowAnnoModeAlert if action.isLogout is true', () => {
      const action = { type: types.FLUSH_STATE, isLogout: true }
      const currentState = getState({
        documents,
        openedDoc: { _id: '1234', name: 'document 1' },
        shouldShowAnnoModeAlert: false
      })
      const state = reducer(currentState, action)
      expect(state.shouldShowAnnoModeAlert).toEqual(true)
    })
  })
})
