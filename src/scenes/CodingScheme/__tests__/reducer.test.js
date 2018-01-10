import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  questions: []
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Coding Scheme reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_SCHEME_SUCCESS', () => {
    test('should set state.questions to action.payload and set hovering to false on all questions', () => {
      const questions = [
        { questionBody: 'fa la la la', type: 1 },
        { questionBody: 'la la la', type: 2 }
      ]

      const action = {
        type: types.GET_SCHEME_SUCCESS,
        payload: questions
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual({
        questions: [
          { questionBody: 'fa la la la', type: 1, hovering: false },
          { questionBody: 'la la la', type: 2, hovering: false }
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
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: true, questionBody: 'la la la', type: 2 }
        ]
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
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ]
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
        questions: [
          {
            hovering: false, questionBody: 'fa la la la', type: 1, children: [
              { hovering: true, questionBody: 'fa la la child', type: 3 }
            ]
          },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ]
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
        questions: [
          { hovering: false, questionBody: 'fa la la la', type: 1 },
          { hovering: false, questionBody: 'la la la', type: 2 }
        ]
      })
    })
  })

  describe('HANDLE_QUESTION_TREE_CHANGE', () => {
    test('should set state.questions to action.questions', () => {
      const questions = [
        { hovering: false, questionBody: 'la la la', type: 2 },
        { hovering: false, questionBody: 'fa la la la', type: 1 }
      ]

      const action = {
        type: types.HANDLE_QUESTION_TREE_CHANGE,
        questions: [
          {
            hovering: false, questionBody: 'la la la', type: 2, children: [
              { hovering: false, questionBody: 'fa la la la', type: 1 }
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
        questions: [
          {
            hovering: false, questionBody: 'la la la', type: 2, children: [
              { hovering: false, questionBody: 'fa la la la', type: 1 }
            ]
          }
        ]
      })
    })
  })
})