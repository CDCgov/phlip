import * as actions from '../actions'
import * as types from '../actionTypes'

describe('Coding scene actions creators', () => {
  test('should create an action to get outline', () => {
    const expectedAction = {
      type: types.GET_CODING_OUTLINE_REQUEST,
      projectId: 1,
      jurisdictionId: 1
    }
    expect(actions.getCodingOutlineRequest(1, 1)).toEqual(expectedAction)
  })

  test('should create an action to answer question', () => {
    const expectedAction = {
      type: types.UPDATE_USER_ANSWER_REQUEST,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      answerId: 1,
      answerValue: 1
    }
    expect(actions.answerQuestionRequest(1,1,1,1,1)).toEqual(expectedAction)
  })

  test('should create an action to handle comment change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_COMMENT,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      comment: 'comment'
    }
    expect(actions.onChangeComment(1, 1, 1, 'comment')).toEqual(expectedAction)
  })

  test('should create an action to handle pincite change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_PINCITE,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      answerId: 1,
      pincite: 'pincite'
    }

    expect(actions.onChangePincite(1,1,1,1,'pincite')).toEqual(expectedAction)
  })

  test('should create an action to handle category change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_CATEGORY,
      selection: 1
    }

    expect(actions.onChangeCategory(null, 1)).toEqual(expectedAction)
  })

  test('should create an action to handle clearing answers', () => {
    const expectedAction = {
      type: types.ON_CLEAR_ANSWER,
      questionId: 1,
      projectId: 1,
      jurisdictionId: 1
    }

    expect(actions.onClearAnswer(1, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to handle close code screen', () => {
    const expectedAction = {
      type: types.ON_CLOSE_CODE_SCREEN
    }

    expect(actions.onCloseCodeScreen()).toEqual(expectedAction)
  })

  test('should create an action to handle get next question', () => {
    const expectedAction = {
      type: types.GET_NEXT_QUESTION,
      id: 1,
      newIndex: 1
    }

    expect(actions.getNextQuestion(1,1)).toEqual(expectedAction)
  })

  test('should create an action to handle get previous question', () => {
    const expectedAction = {
      type: types.GET_PREV_QUESTION,
      id: 1,
      newIndex: 1
    }

    expect(actions.getPrevQuestion(1,1)).toEqual(expectedAction)
  })
})