import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Coding reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_CODING_OUTLINE_SUCCESS', () => {
    test('should set outline, scheme, current question and userAnswers based on action.payload', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          scheme: questions,
          questionOrder: [1, 2],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 }
          },
          tree: [],
          question: questions[0],
          codedQuestions: [
            { schemeQuestionId: 1, codedAnswers: [{ schemeAnswerId: 3, pincite: '' }], comment: '' }
          ]
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      const updatedState = {
        question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          },
          order: [1, 2]
        },
        userAnswers: {
          1: {
            answers: {
              3: { schemeAnswerId: 3, pincite: '' }
            },
            schemeQuestionId: 1,
            comment: ''
          }
        }
      }

      expect(state).toHaveProperty('outline', updatedState.outline)
      expect(state).toHaveProperty('scheme.byId', updatedState.scheme.byId)
      expect(state).toHaveProperty('scheme.order', updatedState.scheme.order)
      expect(state).toHaveProperty('question', updatedState.question)
      expect(state).toHaveProperty('userAnswers', updatedState.userAnswers)
    })

    test('should set scheme.tree based on action.payload.tree', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          question: { id: 1 },
          scheme: questions,
          questionOrder: [1, 2],
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          ],
          codedQuestions: [{ schemeQuestionId: 1, codedAnswers: [{ schemeAnswerId: 3, pincite: '' }], comment: '' }]
        }
      }

      const state = getReducer(getState(), action)

      expect(state).toHaveProperty('scheme.tree', [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: true },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1, isAnswered: false }
      ])
    })

    test('should initialize user answers to empty if payload.codedQuestions is empty', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          scheme: questions,
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          ],
          questionOrder: [1, 2],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 }
          },
          question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          codedQuestions: []
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual(getState({
        question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          },
          order: [1, 2],
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: false },
            { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1, isAnswered: false }
          ]
        },
        userAnswers: {
          1: {
            answers: {},
            schemeQuestionId: 1,
            comment: ''
          }
        }
      }))
    })

    test('should handle category question children in codedQuestions array for userAnswers', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        {
          text: 'la la la',
          questionType: 2,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 4, text: 'cat 2' }, { id: 5, text: 'cat 1' }]
        },
        { text: 'category question child', questionType: 4, id: 3, parentId: 2, positionInParent: 0 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          question: { id: 1 },
          scheme: questions,
          questionOrder: [1, 2, 3],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 },
            3: { parentId: 2, positionInParent: 0 }
          },
          tree: [],
          codedQuestions: [
            {
              schemeQuestionId: 2,
              codedAnswers: [{ schemeAnswerId: 4, pincite: '' }, { schemeAnswerId: 5, pincite: '' }],
              comment: ''
            },
            {
              schemeQuestionId: 3,
              categoryId: 4,
              codedAnswers: [{ schemeAnswerId: 8, pincite: '' }, { schemeAnswerId: 6, pincite: '' }],
              comment: ''
            },
            {
              schemeQuestionId: 3,
              categoryId: 5,
              codedAnswers: [{ schemeAnswerId: 11, pincite: '' }, { schemeAnswerId: 8, pincite: '' }],
              comment: 'this is a comment'
            }
          ]
        }
      }

      const state = getReducer(getState(), action)

      expect(state).toHaveProperty('userAnswers', {
        1: {
          answers: {}
        },
        2: {
          answers: {
            4: { schemeAnswerId: 4, pincite: '' },
            5: { schemeAnswerId: 5, pincite: '' }
          },
          comment: '',
          schemeQuestionId: 2
        },
        3: {
          schemeQuestionId: 3,
          answers: {
            4: {
              answers: {
                8: { schemeAnswerId: 8, pincite: '' },
                6: { schemeAnswerId: 6, pincite: '' }
              }
            },
            5: {
              answers: {
                11: { schemeAnswerId: 11, pincite: '' },
                8: { schemeAnswerId: 8, pincite: '' }
              }
            }
          },
          comment: {
            4: '',
            5: 'this is a comment'
          }
        },
        1: {
          schemeQuestionId: 1,
          answers: {},
          comment: ''
        }
      })

    })

    test('should have categories and children for scheme.tree', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        {
          text: 'la la la',
          questionType: 2,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 4, text: 'cat 2' }, { id: 5, text: 'cat 1' }]
        },
        { text: 'category question child', questionType: 4, id: 3, parentId: 2, positionInParent: 0 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          question: { id: 1 },
          scheme: questions,
          questionOrder: [1, 2, 3],
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            {
              text: 'la la la',
              questionType: 2,
              id: 2,
              parentId: 0,
              positionInParent: 1,
              possibleAnswers: [{ id: 4, text: 'cat 2' }, { id: 5, text: 'cat 1' }],
              children: [
                {
                  text: 'category question child',
                  questionType: 4,
                  id: 3,
                  parentId: 2,
                  positionInParent: 0
                }
              ]
            }
          ],
          codedQuestions: [
            {
              schemeQuestionId: 2,
              codedAnswers: [{ schemeAnswerId: 4, pincite: '' }, { schemeAnswerId: 5, pincite: '' }],
              comment: ''
            },
            {
              schemeQuestionId: 3,
              categoryId: 4,
              codedAnswers: [{ schemeAnswerId: 8, pincite: '' }, { schemeAnswerId: 6, pincite: '' }],
              comment: ''
            },
            {
              schemeQuestionId: 3,
              categoryId: 5,
              codedAnswers: [{ schemeAnswerId: 11, pincite: '' }, { schemeAnswerId: 8, pincite: '' }],
              comment: 'this is a comment'
            }
          ]
        }
      }

      const state = getReducer(getState(), action)

      expect(state)
        .toHaveProperty('scheme.tree', {
            text: 'fa la la la',
            questionType: 1,
            id: 1,
            parentId: 0,
            positionInParent: 0,
            isAnswered: false
          },
          {
            text: 'la la la',
            questionType: 2,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 4, text: 'cat 2' }, { id: 5, text: 'cat 1' }],
            isAnswered: true,
            children: [
              {
                text: 'category question child',
                questionType: 4,
                id: 3,
                parentId: 2,
                positionInParent: 0,
                isAnswered: true
              }
            ]
          })
    })
  })

  describe('GET_NEXT_QUESTION && GET_PREV_QUESTION', () => {
    const currentState = {
      question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 1 },
        3: { parentId: 0, positionInParent: 2 },
        4: { parentId: 3, positionInParent: 0 }
      },
      scheme: {
        byId: {
          1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          2: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
          3: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            possibleAnswers: [
              { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
            ]
          },
          4: {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            positionInParent: 0,
            isCategoryQuestion: true
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
        }
      }
    }

    test('should handle regular questions', () => {
      const action = { type: types.GET_NEXT_QUESTION, id: 2, newIndex: 1 }
      const state = getReducer(getState(currentState), action)

      expect(state)
        .toHaveProperty('question', { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 })
      expect(state).toHaveProperty('showNextButton', true)
    })

    test('should handle category question children', () => {
      const action = { type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3 }

      const state = getReducer(
        getState({
          ...currentState,
          userAnswers: {
            ...currentState.userAnswers,
            3: {
              schemeQuestionId: 3,
              answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
            }
          }
        }),
        action
      )

      expect(state).toHaveProperty('question', {
        text: 'cat question child',
        questionType: 3,
        id: 4,
        parentId: 3,
        positionInParent: 0,
        isCategoryQuestion: true,
        isCategoryChild: true
      })

      expect(state).toHaveProperty('showNextButton', false)
      expect(state).toHaveProperty('currentIndex', 3)
      expect(state).toHaveProperty('userAnswers', {
        ...currentState.userAnswers,
        3: {
          schemeQuestionId: 3,
          answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
        },
        4: {
          schemeQuestionId: 4,
          answers: {
            10: { answers: {} },
            20: { answers: {} }
          },
          comment: {
            10: '',
            20: ''
          }
        }
      })

      expect(state).toHaveProperty('categories', [{ id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }])

    })

    test('should if next question is already in state.userAnswers', () => {
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
        .toHaveProperty('question', { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 })

      expect(state.userAnswers).toHaveProperty('2', {
        schemeQuestionId: 2,
        comment: 'this is a comment',
        answers: {}
      })

      expect(state).toHaveProperty('currentIndex', 1)
    })

    test('should handle if next question is category child and no categories have been selected', () => {
      const currentState = {
        question: {
          text: 'cat question',
          questionType: 2,
          id: 3,
          parentId: 0,
          positionInParent: 2,
          possibleAnswers: [
            { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
          ]
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
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
            3: {
              text: 'cat question',
              questionType: 2,
              id: 3,
              parentId: 0,
              positionInParent: 2,
              possibleAnswers: [
                { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
              ]
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
              positionInParent: 3
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
          positionInParent: 3
        })

      expect(state).toHaveProperty('currentIndex', 4)
      expect(state).toHaveProperty('showNextButton', false)
    })
  })

  describe('UPDATE_USER_ANSWER_REQUEST', () => {
    const currentState = {
      question: {
        text: 'fa la la la',
        questionType: 1,
        id: 1,
        parentId: 0,
        positionInParent: 0,
        possibleAnswers: [{ id: 123, text: 'answer 1', id: 234, text: 'answer 2' }]
      },
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 1 },
        3: { parentId: 0, positionInParent: 2 },
        4: { parentId: 3, positionInParent: 0 }
      },
      scheme: {
        byId: {
          1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          2: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
          3: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            possibleAnswers: [
              { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
            ]
          },
          4: {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            positionInParent: 0,
            indent: 2,
            isCategoryQuestion: true,
            possibleAnswers: [
              { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
            ]
          }
        },
        order: [1, 2, 3, 4],
        tree: [
          { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: false },
          { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
          {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            isAnswered: true,
            indent: 1,
            possibleAnswers: [
              { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
            ],
            children: [
              {
                text: 'cat question child',
                questionType: 3,
                isCategoryQuestion: true,
                id: 4,
                indent: 2,
                parentId: 3,
                positionInParent: 0,
                isAnswered: false,
                possibleAnswers: [
                  { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
                ]
              }
            ]
          }
        ]
      },
      userAnswers: {
        1: {
          answers: {},
          schemeQuestionId: 1,
          comment: ''
        },
        2: {
          answers: {},
          schemeQuestionId: 2,
          comment: ''
        },
        3: {
          schemeQuestionId: 3,
          answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
        },
        4: {
          schemeQuestionId: 4,
          answers: {
            10: { answers: {} },
            20: { answers: {} }
          },
          comment: {
            10: '',
            20: ''
          }
        }
      }
    }

    test('should handle binary / multiple choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER_REQUEST,
        answerId: 123,
        questionId: 1
      }

      const state = getReducer(getState(currentState), action)

      expect(state).toEqual(getState({
        ...currentState,
        userAnswers: {
          ...currentState.userAnswers,
          1: {
            answers: { 123: { schemeAnswerId: 123, pincite: '' } },
            schemeQuestionId: 1,
            comment: ''
          }
        }
      }))

      expect(state).toHaveProperty('scheme.tree', [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: true },
        { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
        {
          text: 'cat question',
          questionType: 2,
          id: 3,
          parentId: 0,
          positionInParent: 2,
          isAnswered: true,
          indent: 1,
          possibleAnswers: [
            { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
          ],
          children: [
            {
              text: 'cat question child',
              questionType: 3,
              isCategoryQuestion: true,
              id: 4,
              parentId: 3,
              positionInParent: 0,
              isAnswered: false,
              indent: 2,
              possibleAnswers: [
                { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
              ],
              children: [
                {
                  schemeAnswerId: 10,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  positionInParent: 0,
                  text: 'category 2',
                  isAnswered: false
                },
                {
                  schemeAnswerId: 20,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  positionInParent: 1,
                  text: 'category 3',
                  isAnswered: false
                }
              ],
              completedProgress: 0
            }
          ]
        }
      ])
    })

    test('should handle checkbox / category choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER_REQUEST,
        answerId: 90,
        questionId: 2
      }

      const state = getReducer(
        getState({
          ...currentState,
          question: {
            text: 'la la la',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }]
          }
        }),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: {
          text: 'la la la',
          questionType: 3,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }]
        },
        userAnswers: {
          ...currentState.userAnswers,
          2: {
            comment: '',
            schemeQuestionId: 2,
            answers: {
              90: { schemeAnswerId: 90, pincite: '' }
            }
          }
        }
      }))
    })
  })

  describe('ON_CHANGE_COMMENT', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment'
      }

      const state = getReducer(
        getState({
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: { 1: { schemeAnswerId: 1 } },
              comment: ''
            }
          }
        }),
        action
      )

      expect(state).toEqual(
        getState({
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: { 1: { schemeAnswerId: 1 } },
              comment: 'new comment'
            }
          },
          showNextButton: false
        })
      )

    })

    test('should handle category questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment for cat 1'
      }

      const state = getReducer(
        getState({
          question: {
            text: 'la la la',
            questionType: 2,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }],
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: { schemeAnswerId: 5 }
                },
                2: {
                  answers: {}
                }
              },
              comment: {
                3: 'comment for cat 1',
                2: 'comment for cat 2'
              }
            }
          },
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            text: 'la la la',
            questionType: 2,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }],
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: { schemeAnswerId: 5 }
                },
                2: {
                  answers: {}
                }
              },
              comment: {
                3: 'new comment for cat 1',
                2: 'comment for cat 2'

              }
            }
          },
          showNextButton: false,
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
    })
  })

  describe('ON_CHANGE_PINCITE', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const state = getReducer(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                1: {
                  schemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  schemeAnswerId: 4,
                  pincite: ''
                }
              },
              comment: ''
            }
          }
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                1: {
                  schemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  schemeAnswerId: 4,
                  pincite: 'this is a pincite'
                }
              },
              comment: ''
            }
          },
          showNextButton: false
        })
      )
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const state = getReducer(
        getState({
          question: {
            questionType: 3,
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 1,
          selectedCategoryId: 2,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 3,
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: 'this is a pincite' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 1,
          showNextButton: false,
          selectedCategoryId: 2,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
    })
  })

  describe('ON_CLEAR_ANSWER', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                1: {
                  schemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  schemeAnswerId: 4,
                  pincite: ''
                }
              },
              comment: ''
            }
          }
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {},
              comment: ''
            }
          },
          showNextButton: false
        })
      )
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(
        getState({
          question: {
            questionType: 4,
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 4,
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {
                3: {
                  answers: {}
                },
                2: {
                  answers: {
                    4: { schemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }],
          showNextButton: false
        })
      )
    })

    test('should update scheme.tree for category questions', () => {
      const currentState = {
        question: {
          text: 'fa la la la',
          questionType: 1,
          id: 1,
          parentId: 0,
          positionInParent: 0,
          possibleAnswers: [{ id: 123, text: 'answer 1', id: 234, text: 'answer 2' }]
        },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 },
          3: { parentId: 0, positionInParent: 2 },
          4: { parentId: 3, positionInParent: 0 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
            3: {
              text: 'cat question',
              questionType: 2,
              id: 3,
              parentId: 0,
              positionInParent: 2,
              possibleAnswers: [
                { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
              ]
            },
            4: {
              text: 'cat question child',
              questionType: 3,
              id: 4,
              parentId: 3,
              positionInParent: 0,
              indent: 2,
              isCategoryQuestion: true,
              possibleAnswers: [
                { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
              ]
            }
          },
          order: [1, 2, 3, 4],
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: true },
            { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
            {
              text: 'cat question',
              questionType: 2,
              id: 3,
              parentId: 0,
              positionInParent: 2,
              isAnswered: true,
              indent: 1,
              possibleAnswers: [
                { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
              ],
              children: [
                {
                  text: 'cat question child',
                  questionType: 3,
                  isCategoryQuestion: true,
                  id: 4,
                  parentId: 3,
                  positionInParent: 0,
                  isAnswered: false,
                  indent: 2,
                  possibleAnswers: [
                    { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
                  ],
                  children: [
                    {
                      schemeAnswerId: 10,
                      schemeQuestionId: 4,
                      indent: 3,
                      isCategory: true,
                      positionInParent: 0,
                      text: 'category 2',
                      isAnswered: false
                    },
                    {
                      schemeAnswerId: 20,
                      schemeQuestionId: 4,
                      indent: 3,
                      isCategory: true,
                      positionInParent: 1,
                      text: 'category 3',
                      isAnswered: false
                    }
                  ],
                  completedProgress: 0
                }
              ]
            }
          ]
        },
        userAnswers: {
          1: {
            answers: { 123: { schemeAnswerId: 123, pincite: '' } },
            schemeQuestionId: 1,
            comment: ''
          },
          2: {
            answers: {},
            schemeQuestionId: 2,
            comment: ''
          },
          3: {
            schemeQuestionId: 3,
            answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
          },
          4: {
            schemeQuestionId: 4,
            answers: {
              10: { answers: {} },
              20: { answers: {} }
            },
            comment: {
              10: '',
              20: ''
            }
          }
        }
      }

      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 3,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(currentState, action)
      expect(state).toHaveProperty('scheme.tree', [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: true },
        { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
        {
          text: 'cat question',
          questionType: 2,
          id: 3,
          parentId: 0,
          positionInParent: 2,
          isAnswered: false,
          indent: 1,
          possibleAnswers: [{ id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }],
          children: []
        }
      ])
    })
  })
})