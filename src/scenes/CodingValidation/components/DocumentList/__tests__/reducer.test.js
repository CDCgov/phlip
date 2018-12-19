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

  describe('GET_CODING/VALIDATION_OUTLINE_SUCCESS, GET_USER_CODED/VALIDATED_QUESTIONS_SUCCESS', () => {
    const payload = {
      userAnswers: {
        4: {
          schemeQuestionId: 4,
          answers: {
            1: {
              schemeAnswerId: 1,
              annotations: JSON.stringify([{ docId: '9101' }])
            }
          }
        },
        5: {
          schemeQuestionId: 5,
          answers: {
            4: {
              schemeAnswerId: 4,
              annotations: JSON.stringify([{ docId: '1234' }])
            }
          }
        }
      },
      question: {
        id: 1
      }
    }

    const currentState = getState({ documents })
    const expectedState = {
      1: { byAnswer: {}, all: [] },
      4: { byAnswer: { 1: ['9101'] }, all: ['9101'] },
      5: { byAnswer: { 4: ['1234'] }, all: ['1234'] }
    }

    test('should set state.documents.annotated', () => {
      let state = reducer(currentState, { type: 'GET_CODING_OUTLINE_SUCCESS', payload })
      expect(state.documents.annotated).toEqual(expectedState)

      state = reducer(currentState, { type: 'GET_VALIDATION_OUTLINE_SUCCESS', payload })
      expect(state.documents.annotated).toEqual(expectedState)

      state = reducer(currentState, { type: 'GET_USER_CODED_QUESTIONS_SUCCESS', payload })
      expect(state.documents.annotated).toEqual(expectedState)

      state = reducer(currentState, { type: 'GET_USER_VALIDATED_QUESTIONS_SUCCESS', payload })
      expect(state.documents.annotated).toEqual(expectedState)
    })
  })

  describe('GET_QUESTION_SUCCESS', () => {
    const payload = {
      updatedState: {
        userAnswers: {
          4: {
            schemeQuestionId: 4,
            answers: {
              1: {
                schemeAnswerId: 1,
                annotations: JSON.stringify([{ docId: '9101' }])
              }
            }
          },
          5: {
            schemeQuestionId: 5,
            answers: {
              4: {
                schemeAnswerId: 4,
                annotations: JSON.stringify([{ docId: '1234' }])
              }
            }
          }
        }
      },
      question: {
        id: 1
      }
    }

    const currentState = getState({ documents })
    const expectedState = {
      1: { byAnswer: {}, all: [] },
      4: { byAnswer: { 1: ['9101'] }, all: ['9101'] },
      5: { byAnswer: { 4: ['1234'] }, all: ['1234'] }
    }

    test('should set state.document.annotated', () => {
      let state = reducer(currentState, { type: 'GET_QUESTION_SUCCESS', payload })
      expect(state.documents.annotated).toEqual(expectedState)
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

    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' }})
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

  describe('CLEAR_DOC_SELECTED', () => {
    const action = { type: types.CLEAR_DOC_SELECTED }
    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' }})
    const state = reducer(currentState, action)

    test('should clear state.openedDoc', () => {
      expect(state.openedDoc).toEqual({})
    })

    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })
  })
})