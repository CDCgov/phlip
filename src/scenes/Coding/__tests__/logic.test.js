import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Coding logic', () => {
  let mock

  const mockReducer = state => state

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = other => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 1 } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  describe('GET_CODING_OUTLINE_REQUEST logic', () => {
    test('should call the api to get the scheme and coded questions', (done) => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'q1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })

      const codedQuestions = [
        {
          'id': 10019,
          'schemeQuestionId': 1,
          'flag': null,
          'comment': '',
          'codedAnswers': [
            {
              'id': 10010,
              'schemeAnswerId': 1,
              'pincite': 'dsfdfdsf',
              'textAnswer': null
            }
          ]
        }
      ]

      const userAnswers = {
        '1': {
          id: 10019,
          schemeQuestionId: 1,
          flag: {
            notes: '',
            type: 0
          },
          comment: '',
          answers: {
            '1': {
              id: 10010,
              schemeAnswerId: 1,
              pincite: 'dsfdfdsf',
              textAnswer: null
            }
          }
        }
      }

      mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions').reply(200, codedQuestions)
      const store = setupStore()
      store.dispatch({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 },
          {
            type: types.GET_CODING_OUTLINE_SUCCESS,
            payload: {
              outline: { 1: { parentId: 0, positionInParent: 0 } },
              userAnswers,
              question: { id: 1, text: 'q1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
              isSchemeEmpty: false,
              areJurisdictionsEmpty: false,
              scheme: {
                byId: { '1': { id: 1, text: 'q1', parentId: 0, positionInParent: 0, indent: 0, number: '1' } },
                order: [1],
                tree: [{ id: 1, text: 'q1', indent: 0, number: '1', parentId: 0, positionInParent: 0 }]
              },
              codedQuestions,
              userId: 1
            }
          }
        ])
        done()
      })
    })

    test('should call the api to create an empty coded question if the question is not coded', (done) => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [
          { id: 1, text: 'question 1' },
          { id: 2, text: 'question 3' },
          { id: 3, text: 'question 4' },
          { id: 4, text: 'question 2' }
        ],
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 2 },
          4: { parentId: 0, positionInParent: 1 },
          3: { parentId: 2, positionInParent: 0 }
        }
      })

      mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions').reply(200, [])
      mock.onPost('/users/1/projects/1/jurisdictions/1/codedquestions/1')
        .reply(200, { schemeQuestionId: 1, id: 100, codedAnswers: [] })

      const store = setupStore()
      store.dispatch({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })

      store.whenComplete(() => {
        expect(store.actions[0]).toEqual({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })
        expect(store.actions[1]).toEqual(
          {
            type: types.GET_CODING_OUTLINE_SUCCESS,
            payload: {
              outline: {
                1: { parentId: 0, positionInParent: 0 },
                2: { parentId: 0, positionInParent: 2 },
                4: { parentId: 0, positionInParent: 1 },
                3: { parentId: 2, positionInParent: 0 }
              },
              codedQuestions: [],
              question: { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
              isSchemeEmpty: false,
              areJurisdictionsEmpty: false,
              scheme: {
                byId: {
                  1: { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
                  4: { id: 4, text: 'question 2', indent: 0, number: '2', parentId: 0, positionInParent: 1 },
                  2: { id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2 },
                  3: { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
                },
                order: [1, 4, 2, 3],
                tree: [
                  { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
                  { id: 4, text: 'question 2', indent: 0, number: '2', parentId: 0, positionInParent: 1 },
                  {
                    id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2,
                    expanded: true,
                    children: [
                      { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
                    ]
                  }
                ]
              },
              userAnswers: {
                1: {
                  schemeQuestionId: 1,
                  id: 100,
                  answers: {},
                  flag: { notes: '', type: 0, raisedBy: {} },
                  comment: ''
                }
              },
              userId: 1
            }
          })
        done()
      })
    })
  })
})