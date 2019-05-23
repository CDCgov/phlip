import { types } from '../actions'
import reducer from '../reducer'

const initial = {
  content: '',
  getProtocolError: null,
  submitting: false,
  alertError: '',
  lockInfo: {},
  lockedAlert: null,
  lockedByCurrentUser: false
}

describe('Protocol reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  test('SAVE_PROTOCOL_REQUEST', () => {
    expect(reducer(initial, { type: types.SAVE_PROTOCOL_REQUEST, payload: '' })).toEqual({
      ...initial,
      submitting: true
    })
  })

  test('SAVE_PROTOCOL_FAIL', () => {
    expect(reducer(initial, { type: types.SAVE_PROTOCOL_FAIL, payload: 'could not save protocol' })).toEqual({
      ...initial,
      alertError: 'could not save protocol'
    })
  })

  test('SAVE_PROTOCOL_SUCCESS', () => {
    expect(reducer(initial, { type: types.SAVE_PROTOCOL_SUCCESS, payload: '' })).toEqual(initial)
  })

  test('GET_PROTOCOL_SUCCESS', () => {
    expect(reducer(initial, {
      type: types.GET_PROTOCOL_SUCCESS,
      payload: { protocol: 'this is protocol', lockInfo: {}, lockedByCurrentUser: false, error: {} }
    })).toEqual({
      ...initial,
      content: 'this is protocol',
      getProtocolError: null
    })
  })

  test('GET_PROTOCOL_FAIL', () => {
    expect(reducer(initial, { type: types.GET_PROTOCOL_FAIL, payload: '' })).toEqual({
      ...initial,
      getProtocolError: true
    })
  })

  test('UPDATE_PROTOCOL', () => {
    expect(reducer(initial, { type: types.UPDATE_PROTOCOL, content: 'this is protocol' })).toEqual({
      ...initial,
      content: 'this is protocol',
      submitting: false
    })
  })

  test('CLEAR_STATE', () => {
    expect(reducer({ content: 'protocol content' }, { type: types.CLEAR_STATE }))
      .toEqual({
        content: '',
        alertError: '',
        getProtocolError: null,
        submitting: false,
        lockInfo: {},
        lockedByCurrentUser: false,
        lockedAlert: null
      })
  })
})
