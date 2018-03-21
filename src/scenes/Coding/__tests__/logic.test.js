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

  const setupStore = (currentState = {}) => {
    return createMockStore({
      initialState: {
        data: {
          user: { currentUser: { id: 1 } }
        },
        scenes: {
          coding: { ...currentState }
        }
      },
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

  describe('GET_NEXT_QUESTION, GET_PREV_QUESTION, ON_QUESTION_SELECTED_IN_NAV logic', () => {
    const currentState = {
      question: {
        text: 'fa la la la',
        questionType: 1,
        id: 1,
        parentId: 0,
        positionInParent: 0,
        possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
      },
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 1 },
        3: { parentId: 0, positionInParent: 2 },
        4: { parentId: 3, positionInParent: 0 }
      },
      scheme: {
        byId: {
          1: {
            text: 'fa la la la',
            questionType: 1,
            id: 1,
            parentId: 0,
            positionInParent: 0,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          },
          2: {
            text: 'la la la',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          },
          3: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            possibleAnswers: [
              { id: 5, text: 'category 1', order: 1 }, { id: 10, text: 'category 2', order: 2 },
              { id: 20, text: 'category 3', order: 3 }
            ]
          },
          4: {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            positionInParent: 0,
            isCategoryQuestion: true,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          }
        },
        order: [1, 2, 3, 4],
        tree: []
      },
      userAnswers: {
        1: {
          answers: {},
          schemeQuestionId: 1,
          comment: ''
        },
        3: {
          schemeQuestionId: 3,
          answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
        }
      }
    }

    describe('should GET_NEXT_QUESTION based on action and state information', () => {
      test('should handle regular questions', (done) => {
        mock.onPost('/users/1/projects/1/jurisdictions/1/codedquestions/2')
          .reply(200, { schemeQuestionId: 2, id: 200, codedAnswers: [] })

        mock.onGet('/projects/1/scheme/2').reply(200, {
          id: 2, text: 'la la la updated',
          questionType: 3,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        })

        const store = setupStore(currentState)
        store.dispatch({ type: types.GET_NEXT_QUESTION, id: 2, newIndex: 1, projectId: 1, jurisdictionId: 1 })
        store.whenComplete(() => {
          expect(store.actions[0])
            .toEqual({ type: types.GET_NEXT_QUESTION, id: 2, newIndex: 1, projectId: 1, jurisdictionId: 1 })

          // Should get the correct next question and should update from the api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            text: 'la la la updated',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          })

          // Should add the new unanswered question to user answers
          expect(store.actions[1].payload).toHaveProperty('updatedState.userAnswers', {
            1: {
              answers: {},
              schemeQuestionId: 1,
              comment: ''
            },
            2: {
              answers: {},
              id: 200,
              schemeQuestionId: 2,
              comment: '',
              flag: { notes: '', type: 0 }
            },
            3: {
              schemeQuestionId: 3,
              answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
            }
          })
          done()
        })
      })

      test('should handle category question children', (done) => {
        mock.onPost('/users/1/projects/1/jurisdictions/1/codedquestions/4')
          .reply(200, [
            { schemeQuestionId: 4, categoryId: 10, id: 1000, codedAnswers: [] },
            { schemeQuestionId: 4, categoryId: 20, id: 2000, codedAnswers: [] }
          ])

        mock.onGet('/projects/1/scheme/4').reply(200, {
          text: 'cat question child',
          questionType: 3,
          id: 4,
          parentId: 3,
          positionInParent: 0,
          isCategoryQuestion: true,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        })

        const store = setupStore({ ...currentState, selectedCategory: 0 })
        store.dispatch({ type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1 })
        store.whenComplete(() => {
          expect(store.actions[0])
            .toEqual({ type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1 })

          console.log(store.actions)

          // Should get the correct next question and should update from the api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            positionInParent: 0,
            isCategoryQuestion: true,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          })

          // Should add the new unanswered question to user answers
          expect(store.actions[1].payload).toHaveProperty('updatedState.userAnswers', {
            1: {
              answers: {},
              schemeQuestionId: 1,
              comment: ''
            },
            3: {
              schemeQuestionId: 3,
              answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
            },
            4: {
              10: {
                id: 1000,
                answers: {},
                comment: '',
                flag: { notes: '', type: 0 },
                schemeQuestionId: 4,
                categoryId: 10
              },
              20: {
                id: 2000,
                answers: {},
                comment: '',
                flag: { notes: '', type: 0 },
                schemeQuestionId: 4,
                categoryId: 20
              }
            }
          })

          expect(store.actions[1]).toHaveProperty('payload.updatedState.categories', [
            { id: 10, text: 'category 2', order: 2 }, { id: 20, text: 'category 3', order: 3 }
          ])

          done()
        })
      })

      xtest('should handle if next question is already in state.userAnswers', () => {
        const action = {
          type: types.GET_NEXT_QUESTION,
          id: 2,
          newIndex: 1
        }

        const state = getReducer(
          getState({
            ...currentState,
            userAnswers: {
              ...currentState.userAnswers,
              2: {
                schemeQuestionId: 2,
                comment: 'this is a comment',
                answers: {}
              }
            }
          }),
          action
        )

        expect(state)
          .toHaveProperty('question', {
            text: 'la la la',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          })

        expect(state.userAnswers).toHaveProperty('2', {
          schemeQuestionId: 2,
          comment: 'this is a comment',
          answers: {}
        })

        expect(state).toHaveProperty('currentIndex', 1)
      })

      xtest('should handle if next question is category child and no categories have been selected', () => {
        const currentState = {
          question: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          },
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 },
            3: { parentId: 0, positionInParent: 2 },
            4: { parentId: 3, positionInParent: 0 },
            5: { parentId: 0, positionInParent: 3 }
          },
          scheme: {
            byId: {
              1: {
                text: 'fa la la la',
                questionType: 1,
                id: 1,
                parentId: 0,
                positionInParent: 0,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              },
              2: {
                text: 'la la la',
                questionType: 3,
                id: 2,
                parentId: 0,
                positionInParent: 1,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              },
              3: {
                text: 'cat question',
                questionType: 2,
                id: 3,
                parentId: 0,
                positionInParent: 2,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              },
              4: {
                text: 'cat question child',
                questionType: 3,
                id: 4,
                parentId: 3,
                positionInParent: 0,
                isCategoryQuestion: true
              },
              5: {
                text: 'next sibling',
                questionType: 3,
                id: 5,
                parentId: 0,
                positionInParent: 3,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              }
            },
            order: [1, 2, 3, 4, 5],
            tree: []
          },
          userAnswers: {},
          currentIndex: 2
        }

        const action = {
          type: types.GET_NEXT_QUESTION,
          id: 4,
          newIndex: 3
        }

        const state = getReducer(
          getState(currentState),
          action
        )

        expect(state)
          .toHaveProperty('question', {
            text: 'next sibling',
            questionType: 3,
            id: 5,
            parentId: 0,
            positionInParent: 3,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          })

        expect(state).toHaveProperty('currentIndex', 4)
        expect(state).toHaveProperty('showNextButton', false)
      })
    })
  })
})