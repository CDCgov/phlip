import commonActions, * as otherActions from '../actions'
import * as types from '../actionTypes'

const actions = { ...commonActions, ...otherActions }

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

    expect(actions.onChangeCategory(1)).toEqual(expectedAction)
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
      type: types.ON_CLOSE_SCREEN
    }

    expect(actions.onCloseScreen()).toEqual(expectedAction)
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

  test('should create an action to handle to save flag info', () => {
    const expectedAction = {
      type: types.ON_SAVE_FLAG,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      flagInfo: { notes: 'lalala', type: 1 }
    }

    expect(actions.onSaveFlag(1,1,1, { notes: 'lalala', type: 1 })).toEqual(expectedAction)
  })

  test('should create an action to handle to save red flag info', () => {
    const expectedAction = {
      type: types.ON_SAVE_RED_FLAG,
      projectId: 1,
      questionId: 1,
      flagInfo: { notes: 'lalala', type: 3 }
    }

    expect(actions.onSaveRedFlag(1,1, { notes: 'lalala', type: 3 })).toEqual(expectedAction)
  })
})