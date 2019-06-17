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

const annotations = [
  { userId: 4, docId: '1234', isValidatorAnswer: false },
  { userId: 3, docId: '1234', isValidatorAnswer: false },
  { userId: 5, docId: '1234', isValidatorAnswer: true },
  { userId: 1, docId: '5678', isValidatorAnswer: false },
  { userId: 2, docId: '5678', isValidatorAnswer: false },
  { userId: 5, docId: '9101', isValidatorAnswer: true },
  { userId: 4, docId: '9101', isValidatorAnswer: false },
  { userId: 1, docId: '9101', isValidatorAnswer: false }
]

const users = [
  { userId: 1, isValidator: false, enabled: false },
  { userId: 2, isValidator: false, enabled: false },
  { userId: 3, isValidator: false, enabled: false },
  { userId: 4, isValidator: false, enabled: false },
  { userId: 5, isValidator: true, enabled: false }
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
    
    test('should set error information object', () => {
      expect(state.apiError.text).toEqual('Failed to get the list of approved documents.')
      expect(state.apiError.title).toEqual('Request failed')
    })
    
    test('should display error', () => {
      expect(state.apiError.open).toEqual(true)
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
    
    test('should set error information', () => {
      expect(state.apiError.title).toEqual('')
      expect(state.apiError.text).toEqual('Failed to retrieve document contents.')
    })
    
    test('should display error', () => {
      expect(state.apiError.open).toEqual(true)
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
    
    test('should clear error information', () => {
      expect(state.apiError.text).toEqual('')
      expect(state.apiError.title).toEqual('')
    })
    
    test('should set hide error', () => {
      expect(state.apiError.open).toEqual(false)
    })
  })
  
  describe('TOGGLE_ANNOTATION_MODE', () => {
    describe('toggling on annotation mode', () => {
      const action = {
        type: types.TOGGLE_ANNOTATION_MODE,
        enabled: true,
        answerId: 4,
        questionId: 3,
        annotations,
        users
      }
      const currentState = getState({ currentAnnotationIndex: 10 })
      const state = reducer(currentState, action)
      
      test('should set state.enabledAnswerId to action.answerId', () => {
        expect(state.enabledAnswerId).toEqual(4)
      })
      
      test('should set annotations', () => {
        expect(state.annotations.all).toEqual(annotations)
      })
      
      test('should set annotation users', () => {
        expect(state.annotationUsers.all).toEqual(users)
      })
      
      test('should set state.annotationModeEnabled to true', () => {
        expect(state.annotationModeEnabled).toEqual(true)
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
      
      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
    
    describe('toggling off annotation mode', () => {
      const action = {
        type: types.TOGGLE_ANNOTATION_MODE,
        enabled: false,
        answerId: 4,
        questionId: 3,
        annotations: [],
        users: []
      }
      const currentState = getState({ currentAnnotationIndex: 10 })
      const state = reducer(currentState, action)
      
      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })
      
      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })
      
      test('should set state.annotations to an empty array', () => {
        expect(state.annotations.all).toEqual([])
        expect(state.annotations.filtered).toEqual([])
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
      
      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
  })
  
  describe('TOGGLE_CODER_ANNOTATIONS', () => {
    describe('when toggling on annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        isUserAnswerSelected: false
      }
      
      const currentState = getState({
        enabledAnswerId: 4,
        annotations: {
          all: annotations,
          filtered: annotations
        },
        annotationUsers: {
          all: users,
          filtered: users
        },
        openedDoc: {
          _id: '9101'
        }
      })
      const state = reducer(currentState, action)
      
      test('should set whether the current user or validator answer is selected ', () => {
        expect(state.isUserAnswerSelected).toEqual(false)
      })
      
      test('should set state.enabledUserId to action.enabledUserId', () => {
        expect(state.enabledUserId).toEqual(1)
      })
      
      test('should filter annotations for selected user', () => {
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '9101', isValidatorAnswer: false }
        ])
      })
      
      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
    
    describe('when toggle \'all\' annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 'All',
        isUserAnswerSelected: false
      }
      
      const currentState = getState({
        enabledAnswerId: 4,
        enabledUserId: 1,
        isUserAnswerSelected: false,
        openedDoc: {
          _id: '5678',
          content: {}
        },
        annotations: {
          all: annotations,
          filtered: [{ docId: '5678', userId: 1 }]
        },
        annotationUsers: {
          all: users,
          filtered: [
            { userId: 1, isValidator: false, enabled: true },
            { userId: 2, isValidator: false, enabled: false }
          ]
        }
      })
      
      const state = reducer(currentState, action)
      
      test('should scroll to top', () => {
        expect(state.scrollTop).toEqual(true)
      })
      
      test('should set user id to all', () => {
        expect(state.enabledUserId).toEqual('All')
      })
      
      test('should set filtered annotations to all for opened document', () => {
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '5678', isValidatorAnswer: false },
          { userId: 2, docId: '5678', isValidatorAnswer: false }
        ])
      })
      
      test('should set disable all avatars for users for opened document', () => {
        expect(state.annotationUsers.filtered).toEqual([
          { userId: 1, isValidator: false, enabled: false },
          { userId: 2, isValidator: false, enabled: false }
        ])
      })
      
      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
  })
  
  describe('TOGGLE_VIEW_ANNOTATIONS', () => {
    describe('when turning off view', () => {
      const action = {
        type: types.TOGGLE_VIEW_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        annotations: [],
        users: []
      }
      
      const currentState = getState({
        enabledAnswerId: 4,
        enabledUserId: 1,
        isUserAnswerSelected: true,
        openedDoc: {
          _id: '1234',
          content: {}
        },
        annotations: {
          all: annotations,
          filtered: [{ docId: '5678', userId: 1 }]
        },
        annotationUsers: {
          all: users,
          filtered: [{ userId: 1, isValidator: false }]
        }
      })
      
      const state = reducer(currentState, action)
      
      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })
      
      test('should clear selected user id', () => {
        expect(state.enabledUserId).toEqual('')
      })
      
      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })
      
      test('should clear annotations', () => {
        expect(state.annotations.all).toEqual([])
        expect(state.annotations.filtered).toEqual([])
      })
      
      test('should clear annotation users', () => {
        expect(state.annotationUsers.all).toEqual([])
        expect(state.annotationUsers.filtered).toEqual([])
      })
      
      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })
      
      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
  })
  
  describe('CHANGE_ANNOTATION_INDEX', () => {
    const action = { type: types.CHANGE_ANNOTATION_INDEX, index: 10 }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should change current annotation index to number passed', () => {
      expect(state.currentAnnotationIndex).toEqual(10)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('shdould set state to initial state', () => {
      const action = { type: types.FLUSH_STATE }
      const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
      const state = reducer(currentState, action)
      expect(state).toEqual(INITIAL_STATE)
    })
  })
})
