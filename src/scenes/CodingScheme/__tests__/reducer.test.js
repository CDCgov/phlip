import * as types from '../actionTypes'
import reducer, { INITIAL_STATE as initial } from '../reducer'

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Coding Scheme reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_SCHEME_SUCCESS', () => {
    test('should set state.questions to action.payload and set hovering to false on all questions', () => {
      const questions = [
        { text: 'fa la la la', type: 1, id: 1, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] },
        { text: 'la la la', type: 2, id: 2, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] }
      ]

      const action = {
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme: {
            schemeQuestions: questions,
            outline: {
              1: { parentId: 0, positionInParent: 0 },
              2: { parentId: 0, positionInParent: 1 }
            }
          },
          lockInfo: {},
          lockedByCurrentUser: false,
          error: {}
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          { text: 'fa la la la', type: 1, hovering: false, id: 1, expanded: true, parentId: 0, positionInParent: 0, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] },
          { text: 'la la la', type: 2, hovering: false, id: 2, expanded: true, parentId: 0, positionInParent: 1, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] }
        ],
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 }
        },
        allowHover: true,
        empty: false,
        alertError: '',
        flatQuestions: [
          { id: 1, text: 'fa la la la', type: 1, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] },
          { id: 2, text: 'la la la', type: 2, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }] }
        ]
      })
    })
  })

  describe('TOGGLE_HOVER', () => {
    test('should set the hovering field to true on node if action.hover = true', () => {
      const questions = [
        { hovering: false, questionBody: 'fa la la la', type: 1 },
        { hovering: false, questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.TOGGLE_HOVER,
        node: { hovering: false, questionBody: 'la la la', type: 2 },
        path: [1],
        hover: true
      }

      const state = getReducer(
        getState({ questions }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: true, questionBody: 'la la la', type: 2 }
        ],
        outline: {},
        allowHover: true,
        flatQuestions: []
      })
    })

    test('should set the hovering field to false on node if action.hover = false', () => {
      const questions = [
        { hovering: true, questionBody: 'fa la la la', type: 1 },
        { hovering: false, questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.TOGGLE_HOVER,
        node: { hovering: true, questionBody: 'fa la la la', type: 1 },
        path: [0],
        hover: false
      }

      const state = getReducer(
        getState({ questions }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ],
        outline: {},
        allowHover: true,
        flatQuestions: []
      })
    })

    test('should set the hovering field on a child node', () => {
      const questions = [
        {
          hovering: false, questionBody: 'fa la la la', type: 1, children: [
            { hovering: false, questionBody: 'fa la la child', type: 3 }
          ]
        },
        { hovering: false, questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.TOGGLE_HOVER,
        node: { hovering: true, questionBody: 'fa la la child', type: 3 },
        path: [0, 1],
        hover: true
      }

      const state = getReducer(
        getState({ questions }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          {
            hovering: false, questionBody: 'fa la la la', type: 1, children: [
              { hovering: true, questionBody: 'fa la la child', type: 3 }
            ]
          },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ],
        outline: {},
        allowHover: true,
        flatQuestions: []
      })
    })

    test('should return current state if node is not found', () => {
      const questions = [
        { hovering: false, questionBody: 'fa la la la', type: 1 },
        { hovering: false, questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.TOGGLE_HOVER,
        node: {},
        path: [10],
        hover: true
      }

      const state = getReducer(
        getState({ questions }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ],
        outline: {},
        allowHover: true,
        flatQuestions: []
      })
    })

    test('should not change hovering field if allowHover is set to false', () => {
      const questions = [
        { hovering: false, questionBody: 'fa la la la', type: 1 },
        { hovering: false, questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.TOGGLE_HOVER,
        node: {},
        path: [10],
        hover: true
      }

      const state = getReducer(
        getState({ questions, allowHover: false }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ],
        outline: {},
        allowHover: false,
        flatQuestions: []
      })
    })
  })

  describe('HANDLE_QUESTION_TREE_CHANGE', () => {
    test('should set state.questions to action.questions and update outline', () => {
      const questions = [
        { hovering: false, questionBody: 'la la la', type: 2, id: 1 },
        { hovering: false, questionBody: 'fa la la la', type: 1, id: 2 }
      ]

      const action = {
        type: types.HANDLE_QUESTION_TREE_CHANGE,
        questions: [
          {
            hovering: false, questionBody: 'la la la', type: 2, id: 2, children: [
              { hovering: false, questionBody: 'fa la la la', type: 1, id: 1 }
            ]
          }
        ]
      }

      const state = getReducer(
        getState({
          questions
        }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [
          {
            hovering: false,
            questionBody: 'la la la',
            type: 2,
            id: 2,
            children: [
              { hovering: false, questionBody: 'fa la la la', type: 1, id: 1 }
            ]
          }
        ],
        outline: {
          1: { parentId: 2, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 0 }
        },
        allowHover: true,
        flatQuestions: [],
        previousOutline: {},
        previousQuestions: [
          { hovering: false, questionBody: 'la la la', type: 2, id: 1 },
          { hovering: false, questionBody: 'fa la la la', type: 1, id: 2 }
        ]
      })
    })
  })

  describe('ENABLE_HOVER', () => {
    test('should set allow hover to true', () => {
      const action = {
        type: types.ENABLE_HOVER
      }
      const state = getReducer(
        getState({ allowHover: false }),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [],
        outline: {},
        allowHover: true,
        flatQuestions: []
      })
    })
  })

  describe('DISABLE_HOVER', () => {
    test('should set allow hover to false', () => {
      const action = {
        type: types.DISABLE_HOVER
      }
      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual({
        ...initial,
        questions: [],
        outline: {},
        allowHover: false,
        flatQuestions: []
      })
    })
  })
})