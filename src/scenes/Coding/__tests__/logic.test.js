import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Coding logic', () => {
  let mock

  const mockReducer = state => state

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = other => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 1 } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  test('should call the api to get the scheme and coded questions and dispatch GET_CODING_OUTLINE_SUCCESS when successful', (done) => {
    mock.onGet('/projects/1/scheme').reply(200, {
      schemeQuestions: [{ id: 1, text: 'question 1' }],
      outline: { 1: { parentId: 0, positionInParent: 0 } }
    })

    mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions').reply(200, [])

    const store = setupStore()
    store.dispatch({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 },
        {
          type: types.GET_CODING_OUTLINE_SUCCESS,
          payload: {
            outline: { 1: { parentId: 0, positionInParent: 0 } },
            codedQuestions: [],
            question: { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
            isSchemeEmpty: false,
            questionOrder: [1],
            scheme: [{ id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 }],
            tree: [{ id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 }],
            userId: 1
          }
        }
      ])
      done()
    })
  })

  test('should update children of questions and order when getting scheme with nested questions', (done) => {
    mock.onGet('/projects/1/scheme').reply(200, {
      schemeQuestions: [
        { id: 1, text: 'question 1' },
        { id: 2, text: 'question 3' },
        { id: 3, text: 'question 4' },
        { id: 4, text: 'question 2' }
      ],
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 2 },
        4: { parentId: 0, positionInParent: 1 },
        3: { parentId: 2, positionInParent: 0 }
      }
    })

    mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions').reply(200, [])

    const store = setupStore()
    store.dispatch({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })

    store.whenComplete(() => {

      expect(store.actions[0]).toEqual({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })
      expect(store.actions[1]).toEqual(
        {
          type: types.GET_CODING_OUTLINE_SUCCESS,
          payload: {
            outline: {
              1: { parentId: 0, positionInParent: 0 },
              2: { parentId: 0, positionInParent: 2 },
              4: { parentId: 0, positionInParent: 1 },
              3: { parentId: 2, positionInParent: 0 }
            },
            codedQuestions: [],
            question: { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
            isSchemeEmpty: false,
            questionOrder: [1, 4, 2, 3],
            scheme: [
              { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
              { id: 4, text: 'question 2', indent: 0, number: '2', parentId: 0, positionInParent: 1 },
              { id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2, },
              { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
            ],
            tree: [
              { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
              { id: 4, text: 'question 2', indent: 0, number: '2', parentId: 0, positionInParent: 1 },
              {
                id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2,
                expanded: true,
                children: [
                  { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
                ]
              }
            ],
            userId: 1
          }
        })
      done()
    })
  })
})