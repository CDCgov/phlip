import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  content: ''
}

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

  test('CLEAR_STATE', () => {
    expect(reducer({ content: 'protocol content'}, { type: types.CLEAR_STATE })).toEqual({ content: '' })
  })
})