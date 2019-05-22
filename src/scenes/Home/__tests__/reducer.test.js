import { types } from '../actions'
import { mainReducer as reducer, INITIAL_STATE as initial } from '../reducer'
import { types as projectTypes } from 'data/projects/actions'

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Home reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('SET_PROJECTS', () => {
    const currentState = getState()
    const state = reducer(
      currentState,
      {
        type: projectTypes.SET_PROJECTS,
        payload: {
          projects: {
            visible: [1, 2],
            matches: []
          },
          bookmarkList: [],
          error: false,
          errorContent: '',
          searchValue: ''
        }
      }
    )
    
    test('it should set projects', () => {
      expect(state.projects).toEqual({
        visible: [1, 2],
        matches: []
      })
    })
    
    test('should set the rest of the payload items', () => {
      expect(state.bookmarkList).toEqual([])
      expect(state.error).toEqual(false)
      expect(state.errorContent).toEqual('')
      expect(state.searchValue).toEqual('')
    })
  })

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set state.bookmarkList to action.payload.bookmarkList', () => {
      const currentState = getState()
      const state = reducer(currentState, {
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: { bookmarkList: [1, 2, 3] }
      })

      expect(state.bookmarkList).toEqual([1, 2, 3])
    })
  })

  describe('GET_PROJECTS_FAIL', () => {
    const state = reducer(getState({}), { type: types.GET_PROJECTS_FAIL })
    test('should set state.errorContent', () => {
      expect(state.errorContent).toEqual('We couldn\'t retrieve the project list. Please try again later.')
    })

    test('should set state.error to true', () => {
      expect(state.error).toEqual(true)
    })
  })

  describe('GET_PROJECTS_REQUEST', () => {
    test('shouldn\'t change anything in state', () => {
      const currentState = getState()
      const state = reducer(currentState, { type: types.GET_PROJECTS_REQUEST })
      expect(state).toEqual(initial)
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state to initial state, expect for rowsPerPage', () => {
      const state = reducer(getState({ rowsPerPage: 5 }), { type: types.FLUSH_STATE })
      expect(state).toEqual(getState({ rowsPerPage: 5, projects: { visible: [], matches: [] } }))
    })
  })
})
