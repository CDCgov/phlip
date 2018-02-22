import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  content: ''
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Protocol reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  test('GET_PROTOCOL_SUCCESS', () => {
    expect(reducer(initial, { type: types.GET_PROTOCOL_SUCCESS, payload: 'this is protocol' })).toEqual({
      content: 'this is protocol'
    })
  })

  test('UPDATE_PROTOCOL', () => {
    expect(reducer(initial, { type: types.UPDATE_PROTOCOL, content: 'this is protocol' })).toEqual({
      content: 'this is protocol'
    })
  })
})