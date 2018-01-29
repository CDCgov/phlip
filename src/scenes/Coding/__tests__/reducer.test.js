import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  question: {},
  scheme: {},
  outline: {},
  jurisdiction: {},
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {}
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
          question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          codedQuestions: [{ codingSchemeQuestionId: 1, answers: [{ codingSchemeAnswerId: 3 }] }]
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
          order: [1, 2]
        },
        userAnswers: {
          1: {
            answers: {
              3: { codingSchemeAnswerId: 3 }
            },
            codingSchemeQuestionId: 1
          }
        }
      }))
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
          order: [1, 2]
        },
        userAnswers: {
          1: {
            answers: {},
            codingSchemeQuestionId: 1,
            comment: ''
          }
        }
      }))
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
          4: { text: 'cat question child', questionType: 3, id: 4, parentId: 3, positionInParent: 0 }
        },
        order: [1, 2, 3, 4]
      },
      userAnswers: {
        1: {
          answers: {},
          codingSchemeQuestionId: 1,
          comment: ''
        }
      }
    }

    test('should handle regular questions', () => {
      const action = {
        type: types.GET_NEXT_QUESTION,
        id: 2,
        newIndex: 1
      }

      const state = getReducer(
        getState(currentState),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
        currentIndex: 1,
        userAnswers: {
          1: {
            answers: {},
            codingSchemeQuestionId: 1,
            comment: ''
          },
          2: {
            answers: {},
            codingSchemeQuestionId: 2,
            comment: ''
          }
        }
      }))
    })

    test('should handle category question children', () => {
      const action = {
        type: types.GET_NEXT_QUESTION,
        id: 4,
        newIndex: 3
      }

      const state = getReducer(
        getState({
          ...currentState,
          userAnswers: {
            ...currentState.userAnswers,
            3: {
              codingSchemeQuestionId: 3,
              answers: { 10: { codingSchemeAnswerId: 10, pincite: '' }, 20: { codingSchemeAnswerId: 20, pincite: '' } }
            }
          }
        }),
        action
      )

      console.log(state)

      expect(state).toEqual(getState({
        ...currentState,
        question: {
          text: 'cat question child',
          questionType: 3,
          id: 4,
          parentId: 3,
          positionInParent: 0,
          isCategoryChild: true
        },
        currentIndex: 3,
        userAnswers: {
          ...currentState.userAnswers,
          3: {
            codingSchemeQuestionId: 3,
            answers: { 10: { codingSchemeAnswerId: 10, pincite: '' }, 20: { codingSchemeAnswerId: 20, pincite: '' } }
          },
          4: {
            codingSchemeQuestionId: 4,
            answers: {
              10: { answers: {} },
              20: { answers: {} }
            },
            comment: {
              10: '',
              20: ''
            }
          }
        },
        categories: [{ id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }]
      }))

    })
  })

})