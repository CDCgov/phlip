import * as actions from '../actions'
import * as types from '../actionTypes'

describe('Coding Scheme actions creators', () => {
  test('should create an action to get coding scheme', () => {
    const expectedAction = {
      type: types.GET_SCHEME_REQUEST,
      id: 1
    }
    expect(actions.getSchemeRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to toggle hovering', () => {
    const expectedAction = {
      type: types.TOGGLE_HOVER,
      node: { id: 4 },
      path: [1,2,3]
    }
    expect(actions.toggleHover({ id: 4 }, [1,2,3])).toEqual(expectedAction)
  })

  test('should create an action to handle question tree change', () => {
    const expectedAction = {
      type: types.HANDLE_QUESTION_TREE_CHANGE,
      questions: [{ id: 4 }, { id: 5 }]
    }
    expect(actions.updateQuestionTree([{ id: 4}, { id: 5 }])).toEqual(expectedAction)
  })
})
