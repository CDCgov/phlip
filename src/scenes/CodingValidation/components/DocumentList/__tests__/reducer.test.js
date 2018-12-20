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

  describe('GET_QUESTION_SUCCESS / GET_USER_VALIDATED/CODED_QUESTIONS_SUCCESS', () => {
    const payload = {
      updatedState: {
        userAnswers: {
          4: {
            schemeQuestionId: 4,
            answers: {
              300: {
                schemeAnswerId: 300,
                annotations: JSON.stringify([{ docId: '9101' }])
              }
            }
          },
          5: {
            schemeQuestionId: 5,
            answers: {
              100: {
                schemeAnswerId: 100,
                annotations: JSON.stringify([{ docId: '1234' }])
              }
            }
          },
          7: {
            201: {
              categoryId: 201,
              schemeQuestionId: 7,
              answers: {
                501: {
                  schemeAnswerId: 501,
                  annotations: JSON.stringify([{ docId: '333' }])
                }
              }
            }
          }
        },
        scheme: {
          byId: {
            4: { id: 4, isCategoryQuestion: false, possibleAnswers: [{ id: 300 }, { id: 301 }, { id: 302 }] },
            5: { id: 5, isCategoryQuestion: false, possibleAnswers: [{ id: 100 }, { id: 101 }, { id: 102 }] },
            1: { id: 1, isCategoryQuestion: false, possibleAnswers: [{ id: 400 }, { id: 401 }, { id: 402 }] },
            6: { id: 6, isCategoryQuestion: false, possibleAnswers: [{ id: 200 }, { id: 201 }, { id: 202 }] },
            7: { id: 7, parentId: 6, isCategoryQuestion: true, possibleAnswers: [{ id: 500 }, { id: 501 }, { id: 502 }] }
          }
        }
      },
      question: {
        id: 1,
        possibleAnswers: [{ id: 400 }, { id: 401 }, { id: 402 }]
      }
    }

    const expectedState = {
      1: {
        all: [],
        byAnswer: {
          400: [],
          401: [],
          402: []
        }
      },
      4: { byAnswer: { 300: ['9101'], 301: [], 302: [] }, all: ['9101'] },
      5: { byAnswer: { 100: ['1234'], 101: [], 102: [] }, all: ['1234'] },
      7: {
        200: {
          byAnswer: {
            500: [],
            501: [],
            502: []
          },
          all: []
        },
        201: {
          byAnswer: {
            500: [],
            501: ['333'],
            502: []
          },
          all: ['333']
        },
        202: {
          byAnswer: {
            500: [],
            501: [],
            502: []
          },
          all: []
        }
      }
    }

    const currentState = getState({ documents })
    let state = reducer(currentState, { type: 'GET_QUESTION_SUCCESS', payload })

    test('should create an entry for action.payload.question for each possible answer in documents.annotated', () => {
      expect(state.documents.annotated).toHaveProperty('1')
      expect(state.documents.annotated[1]).toEqual(expectedState[1])
    })

    test('should create an entry in documents.annotated for each value in payload.userAnswers', () => {
      expect(state.documents.annotated).toHaveProperty('4')
      expect(state.documents.annotated).toHaveProperty('5')
      expect(state.documents.annotated[4]).toEqual(expectedState[4])
      expect(state.documents.annotated[5]).toEqual(expectedState[5])
    })

    test('should be able to handle category questions', () => {
      expect(state.documents.annotated).toHaveProperty('7')
      expect(state.documents.annotated[7]).toEqual(expectedState[7])
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

  describe('CLEAR_DOC_SELECTED', () => {
    const action = { type: types.CLEAR_DOC_SELECTED }
    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
    const state = reducer(currentState, action)

    test('should clear state.openedDoc', () => {
      expect(state.openedDoc).toEqual({})
    })

    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })
  })
})