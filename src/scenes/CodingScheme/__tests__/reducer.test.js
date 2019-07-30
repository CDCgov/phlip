import { types } from '../actions'
import reducer, { INITIAL_STATE as initial } from '../reducer'

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

const questions = [
  {
    text: 'fa la la la',
    type: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'la la la',
    type: 2,
    id: 2,
    parentId: 0,
    positionInParent: 1,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

const questionsWithChildren = [
  {
    text: 'fa la la la',
    type: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }],
    children: [
      {
        text: 'child question 1',
        type: 1,
        id: 4,
        parentId: 1,
        positionInParent: 0,
        possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }],
        children: []
      },
      {
        text: 'child question 2',
        type: 1,
        id: 5,
        parentId: 1,
        positionInParent: 1,
        possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }],
        children: [
          {
            text: 'sub sub question',
            type: 1,
            id: 6,
            parentId: 5,
            positionInParent: 0,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          }
        ]
      }
    ]
  },
  {
    text: 'la la la',
    type: 2,
    id: 2,
    parentId: 0,
    positionInParent: 1,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'q3',
    type: 1,
    id: 3,
    parentId: 0,
    positionInParent: 2,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

const flatQuestionsWithChildren = [
  {
    text: 'fa la la la',
    type: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'child question 1',
    type: 1,
    id: 4,
    parentId: 1,
    positionInParent: 0,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'child question 2',
    type: 1,
    id: 5,
    parentId: 1,
    positionInParent: 1,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'sub sub question',
    type: 1,
    id: 6,
    parentId: 5,
    positionInParent: 0,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'la la la',
    type: 2,
    id: 2,
    parentId: 0,
    positionInParent: 1,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  },
  {
    text: 'q3',
    type: 1,
    id: 3,
    parentId: 0,
    positionInParent: 2,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

const outline = {
  1: { parentId: 0, positionInParent: 0 },
  2: { parentId: 0, positionInParent: 1 }
}

const outlineWithChildren = {
  1: { parentId: 0, positionInParent: 0 },
  2: { parentId: 0, positionInParent: 1 },
  3: { parentId: 0, positionInParent: 2 },
  4: { parentId: 1, positionInParent: 0 },
  5: { parentId: 1, positionInParent: 1 },
  6: { parentId: 5, positionInParent: 0 }
}

describe('Coding Scheme reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('GET_SCHEME_SUCCESS', () => {
    describe('when the scheme is not empty', () => {
      const action = {
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme: {
            schemeQuestions: questions,
            outline
          },
          lockInfo: {},
          lockedByCurrentUser: false,
          error: {}
        }
      }
      
      const currentState = getState({ empty: true })
      const state = reducer(currentState, action)
      
      test('should set state.questions to action.payload and set hovering to false on all questions', () => {
        expect(state.questions).toEqual([
          { ...questions[0], hovering: false, expanded: true },
          { ...questions[1], hovering: false, expanded: true }
        ])
      })
      
      test('should set that the scheme is not empty', () => {
        expect(state.empty).toEqual(false)
      })
    })
    
    describe('when the scheme is empty', () => {
      const action = {
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme: {
            schemeQuestions: [],
            outline: {}
          },
          lockInfo: {},
          lockedByCurrentUser: false,
          error: {}
        }
      }
      
      const currentState = getState({ empty: true })
      const state = reducer(currentState, action)
      
      test('should set that the scheme is empty', () => {
        expect(state.empty).toEqual(true)
      })
    })
    
    describe('when the scheme is locked', () => {
      describe('when the scheme is not locked by current user', () => {
        const action = {
          type: types.GET_SCHEME_SUCCESS,
          payload: {
            scheme: {
              schemeQuestions: [],
              outline: {}
            },
            lockInfo: {
              firstName: 'test',
              lastName: 'user'
            },
            lockedByCurrentUser: false,
            error: {}
          }
        }
        
        const currentState = getState({ empty: true })
        const state = reducer(currentState, action)
        
        test('should show an alert with current lock information', () => {
          expect(state.lockedAlert).toEqual(true)
        })
        
        test('should indicate that scheme is not locked by current user', () => {
          expect(state.lockedByCurrentUser).toEqual(false)
        })
      })
      
      describe('when the scheme is locked by current user', () => {
        const action = {
          type: types.GET_SCHEME_SUCCESS,
          payload: {
            scheme: {
              schemeQuestions: [],
              outline: {}
            },
            lockInfo: {
              firstName: 'test',
              lastName: 'user'
            },
            lockedByCurrentUser: true,
            error: {}
          }
        }
        
        const currentState = getState({ empty: true })
        const state = reducer(currentState, action)
        
        test('should not show an alert with the current lock information', () => {
          expect(state.lockedAlert).toEqual(null)
        })
        
        test('should indicate that scheme is locked by current user', () => {
          expect(state.lockedByCurrentUser).toEqual(true)
        })
      })
    })
    
    describe('when there\'s an error getting lock information', () => {
      const action = {
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme: {
            schemeQuestions: [],
            outline: {}
          },
          lockInfo: {
            firstName: 'test',
            lastName: 'user'
          },
          lockedByCurrentUser: true,
          error: {
            lockInfo: 'couldnt get lock info'
          }
        }
      }
      
      const currentState = getState({ empty: true })
      const state = reducer(currentState, action)
      
      test('should indicate that there was an error', () => {
        expect(state.alertError).toEqual('couldnt get lock info')
      })
    })
  })
  
  describe('GET_SCHEME_FAIL', () => {
    const action = {
      type: types.GET_SCHEME_FAIL,
      payload: 'couldnt get scheme'
    }
    
    const currentState = getState({ empty: true })
    const state = reducer(currentState, action)
    
    test('should indicate that there was an error getting scheme', () => {
      expect(state.schemeError).toEqual('couldnt get scheme')
    })
  })
  
  describe('RESET_ALERT_ERROR', () => {
    const action = {
      type: types.RESET_ALERT_ERROR
    }
    
    const currentState = getState({ alertError: 'alert here' })
    const state = reducer(currentState, action)
    
    test('should close and reset any alert error', () => {
      expect(state.alertError).toEqual('')
    })
  })
  
  describe('CLOSE_CODING_SCHEME_LOCK_ALERT', () => {
    const action = {
      type: types.CLOSE_CODING_SCHEME_LOCK_ALERT
    }
    
    const currentState = getState({ lockedAlert: true })
    const state = reducer(currentState, action)
    
    test('should close the lock information alert', () => {
      expect(state.lockedAlert).toEqual(null)
    })
  })
  
  describe('REORDER_SCHEME_REQUEST', () => {
    const action = {
      type: types.REORDER_SCHEME_REQUEST
    }
    
    const currentState = getState({ previousQuestions: questions, previousOutline: outline })
    const state = reducer(currentState, action)
    
    test('should return state', () => {
      expect(state).toEqual(currentState)
    })
  })
  
  describe('REORDER_SCHEME_SUCCESS', () => {
    const action = {
      type: types.REORDER_SCHEME_SUCCESS
    }
    
    const currentState = getState({
      previousQuestions: questions,
      previousOutline: outline,
      outline: {
        1: { parentId: 0, positionInParent: 1 },
        2: { parentId: 0, positionInParent: 0 }
      },
      questions: [{ ...questions[1], positionInParent: 0 }, { ...questions[0], positionInParent: 1 }]
    })
    const state = reducer(currentState, action)
    
    test('should clear snapshot of questions', () => {
      expect(state.previousOutline).toEqual({})
    })
    
    test('should clear snapshot of outline', () => {
      expect(state.previousQuestions).toEqual([])
    })
    
    test('should clear any alert', () => {
      expect(state.alertError).toEqual('')
    })
  })
  
  describe('REORDER_SCHEME_FAIL', () => {
    const action = {
      type: types.REORDER_SCHEME_FAIL,
      payload: 'couldnt save edits'
    }
    
    const currentState = getState({
      previousQuestions: questions,
      previousOutline: outline,
      outline: {
        1: { parentId: 0, positionInParent: 1 },
        2: { parentId: 0, positionInParent: 0 }
      },
      questions: [{ ...questions[1], positionInParent: 0 }, { ...questions[0], positionInParent: 1 }]
    })
    const state = reducer(currentState, action)
    
    test('should reset the questions using snapshot', () => {
      expect(state.outline).toEqual(outline)
    })
    
    test('should reset the outline using snapshot', () => {
      expect(state.questions).toEqual(questions)
    })
    
    test('should clear snapshot of outline', () => {
      expect(state.previousQuestions).toEqual([])
    })
    
    test('should clear snapshot of questions', () => {
      expect(state.previousOutline).toEqual({})
    })
    
    test('should indicate that there was an error', () => {
      expect(state.alertError).toEqual('couldnt save edits')
    })
  })
  
  describe('LOCK_SCHEME_REQUEST', () => {
    const action = {
      type: types.LOCK_SCHEME_REQUEST
    }
    
    const currentState = getState({ previousQuestions: questions, previousOutline: outline })
    const state = reducer(currentState, action)
    
    test('should return state', () => {
      expect(state).toEqual(currentState)
    })
  })
  
  describe('LOCK_SCHEME_SUCCESS', () => {
    const action = {
      type: types.LOCK_SCHEME_SUCCESS,
      payload: {
        lockInfo: {
          firstName: 'test',
          lastName: 'user'
        },
        lockedByCurrentUser: false
      }
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set whether it is locked by current user', () => {
      expect(state.lockedByCurrentUser).toEqual(false)
    })
    
    test('should set lock information', () => {
      expect(state.lockInfo).toEqual({ firstName: 'test', lastName: 'user' })
    })
    
    describe('if no lock info comes back', () => {
      test('should not show an alert', () => {
        const action = {
          type: types.LOCK_SCHEME_SUCCESS,
          payload: {
            lockInfo: {},
            lockedByCurrentUser: false
          }
        }
        
        const currentState = getState()
        const state = reducer(currentState, action)
        expect(state.lockedAlert).toEqual(null)
      })
    })
    
    describe('if not locked by current user', () => {
      test('should show an alert informing user', () => {
        const action = {
          type: types.LOCK_SCHEME_SUCCESS,
          payload: {
            lockInfo: {
              firstName: 'test',
              lastName: 'user'
            },
            lockedByCurrentUser: false
          }
        }
        
        const currentState = getState()
        const state = reducer(currentState, action)
        expect(state.lockedAlert).toEqual(true)
      })
    })
    
    describe('if locked by current user', () => {
      test('should not show an alert', () => {
        const action = {
          type: types.LOCK_SCHEME_SUCCESS,
          payload: {
            lockInfo: {
              firstName: 'test',
              lastName: 'user'
            },
            lockedByCurrentUser: true
          }
        }
        
        const currentState = getState()
        const state = reducer(currentState, action)
        expect(state.lockedAlert).toEqual(null)
      })
    })
  })
  
  describe('LOCK_SCHEME_FAIL', () => {
    const action = { type: types.LOCK_SCHEME_FAIL, payload: 'couldnt lock scheme' }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should inform user of error', () => {
      expect(state.alertError).toEqual('couldnt lock scheme')
    })
  })
  
  describe('UNLOCK_SCHEME_REQUEST', () => {
    const action = {
      type: types.UNLOCK_SCHEME_REQUEST
    }
    
    const currentState = getState({ previousQuestions: questions, previousOutline: outline })
    const state = reducer(currentState, action)
    
    test('should return state', () => {
      expect(state).toEqual(currentState)
    })
  })
  
  describe('UNLOCK_SCHEME_SUCCESS', () => {
    const action = { type: types.UNLOCK_SCHEME_SUCCESS }
    const currentState = getState({
      lockInfo: {
        firstName: 'test',
        lastName: 'user'
      },
      lockedByCurrentUser: true
    })
    const state = reducer(currentState, action)
    
    test('should clear any lock information', () => {
      expect(state.lockInfo).toEqual({})
    })
    
    test('should clear the lock by the current user', () => {
      expect(state.lockedByCurrentUser).toEqual(false)
    })
  })
  
  describe('UNLOCK_SCHEME_FAIL', () => {
    const action = { type: types.UNLOCK_SCHEME_FAIL, payload: 'couldnt unlock scheme' }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should inform user of error', () => {
      expect(state.alertError).toEqual('couldnt unlock scheme')
    })
  })
  
  describe('DELETE_QUESTION_REQUEST', () => {
    const action = {
      type: types.DELETE_QUESTION_REQUEST
    }
    
    const currentState = getState({ previousQuestions: questions, previousOutline: outline })
    const state = reducer(currentState, action)
    
    test('should return state', () => {
      expect(state).toEqual(currentState)
    })
  })
  
  describe('DELETE_QUESTION_SUCCESS', () => {
    const action = {
      type: types.DELETE_QUESTION_SUCCESS,
      payload: {
        updatedQuestions: [
          {
            text: 'fa la la la',
            type: 1,
            id: 1,
            parentId: 0,
            positionInParent: 0,
            possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
          }
        ],
        updatedOutline: { 1: { parentId: 0, positionInParent: 0 } }
      }
    }
    
    const currentState = getState({
      questions,
      outline,
      empty: false
    })
    const state = reducer(currentState, action)
    
    test('should set updated questions', () => {
      expect(state.questions).toEqual([
        {
          text: 'fa la la la',
          type: 1,
          id: 1,
          parentId: 0,
          positionInParent: 0,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }
      ])
    })
    
    test('should set updated outline', () => {
      expect(state.outline).toEqual({ 1: { parentId: 0, positionInParent: 0 } })
    })
    
    test('should set that the scheme is not empty', () => {
      expect(state.empty).toEqual(false)
    })
    
    describe('if user removes last question', () => {
      const action = {
        type: types.DELETE_QUESTION_SUCCESS,
        payload: {
          updatedQuestions: [],
          updatedOutline: {}
        }
      }
      
      const currentState = getState({
        questions,
        outline,
        empty: false
      })
      
      const state = reducer(currentState, action)
      test('should set that the scheme is empty', () => {
        expect(state.empty).toEqual(true)
      })
    })
  })
  
  describe('DELETE_QUESTION_FAIL', () => {
    const action = { type: types.DELETE_QUESTION_FAIL, payload: 'couldnt delete question' }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should inform user of error', () => {
      expect(state.alertError).toEqual('couldnt delete question')
    })
  })
  
  describe('ADD_QUESTION_REQUEST', () => {
    const action = { type: types.ADD_QUESTION_REQUEST }
    const currentState = getState({
      formError: 'lala',
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  describe('ADD_QUESTION_SUCCESS', () => {
    const newQuestion = { text: 'new question', id: 4 }
    const action = { type: types.ADD_QUESTION_SUCCESS, payload: newQuestion }
    const currentState = getState({
      questions,
      outline,
      flatQuestions: questions,
      empty: true
    })
    
    const state = reducer(currentState, action)
    
    test('should add question to the list of questions', () => {
      expect(state.questions).toEqual([...questions, newQuestion])
    })
    
    test('should add question to scheme outline', () => {
      expect(state.outline).toEqual({
        ...outline,
        4: { parentId: 0, positionInParent: 2 }
      })
    })
    
    test('should add question to list of flat questions', () => {
      expect(state.flatQuestions).toEqual([...questions, newQuestion])
    })
    
    test('should set that the scheme is not empty', () => {
      expect(state.empty).toEqual(false)
    })
    
    test('should set that there was no error', () => {
      expect(state.error).toEqual(null)
    })
    
    test('should set to go add modal', () => {
      expect(state.goBack).toEqual(true)
    })
  })
  
  describe('ADD_QUESTION_FAIL', () => {
    const action = { type: types.ADD_QUESTION_FAIL, payload: 'failed to add question' }
    const currentState = getState({
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to add question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  describe('ADD_CHILD_QUESTION_REQUEST', () => {
    const action = { type: types.ADD_CHILD_QUESTION_REQUEST }
    const currentState = getState({
      formError: 'lala',
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  xdescribe('ADD_CHILD_QUESTION_SUCCESS', () => {
    const action = {
      type: types.ADD_CHILD_QUESTION_SUCCESS,
      payload: {
        text: 'new question',
        parentId: 4,
        path: [0, 1],
        positionInParent: 0,
        id: 23
      }
    }
    
    const currentState = getState({
      questions: questionsWithChildren,
      outline: outlineWithChildren,
      flatQuestions: flatQuestionsWithChildren
    })
    const state = reducer(currentState, action)
    
    test('should add question to correct path', () => {
      console.log(state.questions[0].children[1])
      // expect(state.questions[0].children[0].children[0]).toEqual({
      //   text: 'new question',
      //   parentId: 4,
      //   path: [0, 1],
      //   hovering: false
      // })
    })
  })
  
  describe('ADD_CHILD_QUESTION_FAIL', () => {
    const action = { type: types.ADD_CHILD_QUESTION_FAIL, payload: 'failed to add question' }
    const currentState = getState({
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to add question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  describe('UPDATE_QUESTION_REQUEST', () => {
    const action = { type: types.UPDATE_QUESTION_REQUEST }
    const currentState = getState({
      formError: 'lala',
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  describe('UPDATE_QUESTION_SUCCESS', () => {
    const action = {
      type: types.UPDATE_QUESTION_SUCCESS,
      payload: {
        path: [1],
        ...questions[1],
        text: 'do re mi'
      }
    }
    
    const currentState = getState({
      questions,
      outline,
      flatQuestions: questions
    })
    const state = reducer(currentState, action)
    
    describe('if question being updated is a root question', () => {
      test('should update the question at correct path', () => {
        expect(state.questions[1]).toEqual({ ...questions[1], text: 'do re mi', path: [1], hovering: false })
      })
      
      test('should update outline if needed', () => {
        expect(state.outline).toEqual(outline)
      })
    })
    
    describe('if question being update is a child question', () => {
      const childQuestion = questionsWithChildren[0].children[1].children[0]
      
      const action = {
        type: types.UPDATE_QUESTION_SUCCESS,
        payload: {
          path: [0, 2, 3],
          ...childQuestion,
          text: 'do re mi'
        }
      }
      
      const currentState = getState({
        questions: questionsWithChildren,
        outline: outlineWithChildren
      })
      const state = reducer(currentState, action)
      
      test('should update the question at correct path', () => {
        expect(state.questions[0].children[1].children[0])
          .toEqual({ ...childQuestion, text: 'do re mi', hovering: false, path: [0, 2, 3] })
      })
      
      test('should update outline if needed', () => {
        expect(state.outline).toEqual(outlineWithChildren)
      })
    })
    
    test('should set that empty if false', () => {
      expect(state.empty).toEqual(false)
    })
    
    test('should set to close the update modal', () => {
      expect(state.goBack).toEqual(true)
    })
  })
  
  describe('UPDATE_QUESTION_FAIL', () => {
    const action = { type: types.UPDATE_QUESTION_FAIL, payload: 'failed to update question' }
    const currentState = getState({
      goBack: true
    })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to update question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  })
  
  describe('SET_EMPTY_STATE', () => {
    test('should set that the scheme is empty if there are no questions', () => {
      const action = { type: types.SET_EMPTY_STATE }
      const currentState = getState({
        questions: [],
        outline: {}
      })
      const state = reducer(currentState, action)
      expect(state.empty).toEqual(true)
    })
    
    test('should set the scheme as not empty if there are questions', () => {
      const action = { type: types.SET_EMPTY_STATE }
      const currentState = getState({
        questions,
        outline
      })
      const state = reducer(currentState, action)
      expect(state.empty).toEqual(false)
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
  
  describe('COPY_CODING_SCHEME_REQUEST', () => {
    test('should indicate that copying is happening', () => {
      const action = {
        type: types.COPY_CODING_SCHEME_REQUEST
      }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.copying).toEqual(true)
    })
  })
  
  describe.skip('COPY_CODING_SCHEME_SUCCESS', () => {
    const action = { type: types.COPY_CODING_SCHEME_SUCCESS, payload: 'couldnt copy coding scheme' }
    const currentState = getState({ copying: true, empty: true })
    const state = reducer(currentState, action)
    
    test('should indicate that copying is not longer happening', () => {
      expect(state.copying).toEqual(false)
    })
    
    test('should set that scheme is no longer empty', () => {
      expect(state.empty).toEqual(false)
    })
  })
  
  describe('COPY_CODING_SCHEME_FAIL', () => {
    const action = { type: types.COPY_CODING_SCHEME_FAIL, payload: 'couldnt copy coding scheme' }
    const currentState = getState({ copying: true })
    const state = reducer(currentState, action)
    
    test('should indicate that copying is not longer happening', () => {
      expect(state.copying).toEqual(false)
    })
    
    test('should inform user of error', () => {
      expect(state.alertError).toEqual('couldnt copy coding scheme')
    })
  })
  
  describe('CLEAR_STATE', () => {
    test('should return the cleared initial state', () => {
      const action = { type: types.CLEAR_STATE }
      const currentState = getState({ questions, outline, flatQuestions: questions })
      const state = reducer(currentState, action)
      expect(state).toEqual(initial)
    })
  })
})
