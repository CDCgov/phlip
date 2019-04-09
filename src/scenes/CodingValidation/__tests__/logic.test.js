import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import apiCalls from 'services/api/calls'
import {
  schemeFromApi,
  schemeOutline,
  schemeById,
  schemeTree,
  schemeOrder,
  userAnswersCoded,
  userCodedQuestions
} from 'utils/testData/coding'

let mock, history = {}

const mockReducer = state => state
const api = createApiHandler({ history }, projectApiInstance, apiCalls)

const setupStore = (currentState = {}) => {
  return createMockStore({
    initialState: {
      data: { user: { currentUser: { id: 1 } } },
      scenes: {
        codingValidation: {
          coding: currentState
        }
      }
    },
    reducer: mockReducer,
    logic,
    injectedDeps: { api }
  })
}

describe('CodingValidation logic', () => {
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })

  describe('SAVE_USER_ANSWER_REQUEST', () => {
    test('should use coding api if state.page is coding', done => {
      mock.onAny().reply(config => {
        return [200, config.url]
      })

      const store = setupStore({
        page: 'coding',
        unsavedChanges: true,
        scheme: { byId: schemeById },
        userAnswers: userAnswersCoded,
        messageQueue: []
      })

      store.dispatch({
        type: types.SAVE_USER_ANSWER_REQUEST,
        projectId: 4,
        jurisdictionId: 32,
        selectedCategoryId: null,
        questionId: 1
      })

      store.whenComplete(async () => {
        const t = await store.actions[0].apiMethods.create({}, {}, { ...store.actions[0].payload })
        expect(t).toEqual('/users/1/projects/4/jurisdictions/32/codedquestions/1')
        done()
      })
    })

    test('should use validation api if state.page is validation', done => {
      mock.onAny().reply(config => {
        return [200, config.url]
      })

      const store = setupStore({
        page: 'validation',
        unsavedChanges: true,
        scheme: { byId: schemeById },
        userAnswers: userAnswersCoded,
        messageQueue: []
      })

      store.dispatch({
        type: types.SAVE_USER_ANSWER_REQUEST,
        projectId: 4,
        jurisdictionId: 32,
        selectedCategoryId: null,
        questionId: 1
      })

      store.whenComplete(async () => {
        const t = await store.actions[0].apiMethods.create({}, {}, { ...store.actions[0].payload })
        expect(t).toEqual('/projects/4/jurisdictions/32/validatedquestions/1')
        done()
      })
    })
  })

  describe('GET_CODING_OUTLINE_REQUEST logic', () => {
    test('should call the api to get the scheme and coded questions', done => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: schemeFromApi,
        outline: schemeOutline
      })

      const userAnswers = userAnswersCoded
      const codedQuestions = userCodedQuestions

      mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions').reply(200, codedQuestions)
      const store = setupStore()
      store.dispatch({ type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1 })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.GET_CODING_OUTLINE_REQUEST,
            projectId: 1,
            jurisdictionId: 1,
            currentUser: {
              id: 1
            },
            payload: {
              scheme: { order: [], byId: {}, tree: [] },
              outline: {},
              question: {},
              userAnswers: {},
              mergedUserQuestions: {},
              categories: undefined,
              areJurisdictionsEmpty: false,
              isSchemeEmpty: false,
              schemeError: null,
              isLoadingPage: false,
              showPageLoader: false,
              errors: {}
            },
            userId: 1
          },
          {
            type: types.GET_CODING_OUTLINE_SUCCESS,
            payload: {
              outline: schemeOutline,
              userAnswers,
              question: schemeById[1],
              isSchemeEmpty: false,
              areJurisdictionsEmpty: false,
              isLoadingPage: false,
              categories: undefined,
              showPageLoader: false,
              mergedUserQuestions: {},
              schemeError: null,
              scheme: {
                byId: schemeById,
                order: schemeOrder,
                tree: schemeTree
              },
              errors: {}
            }
          }
        ])
        done()
      })
    })
  })

  describe('GET_NEXT_QUESTION logic', () => {
    const currentState = {
      question: schemeById[1],
      outline: schemeOutline,
      scheme: {
        byId: schemeById,
        order: schemeOrder,
        tree: schemeTree
      },
      userAnswers: userAnswersCoded,
      errors: {}
    }

    describe('should GET_NEXT_QUESTION based on action and state information', () => {
      test('should handle regular questions', done => {
        const questionInfo = {
          text: 'la la la updated',
          questionType: 3,
          id: 2,
          hint: '',
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }

        const question2CodedAnswers = { schemeQuestionId: 2, id: 200, codedAnswers: [], flag: null, comment: '' }

        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/2').reply(200, question2CodedAnswers)
        mock.onGet('/projects/1/scheme/2').reply(200, questionInfo)

        const store = setupStore(currentState)
        store.dispatch({
          type: types.GET_NEXT_QUESTION,
          id: 2,
          newIndex: 1,
          projectId: 1,
          jurisdictionId: 1,
          questionInfo,
          userId: 1,
          page: 'coding'
        })

        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.GET_NEXT_QUESTION,
            id: 2,
            newIndex: 1,
            projectId: 1,
            jurisdictionId: 1,
            questionInfo: {
              categories: undefined,
              selectedCategory: undefined,
              selectedCategoryId: undefined,
              index: 1,
              question: schemeById[2]
            },
            userId: 1,
            page: 'coding'
          })

          // Should get the correct next question and should update from the api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            ...schemeById[2],
            ...questionInfo
          })
          done()
        })
      })

      test('should handle category question children', done => {
        const updatedCatChildQuestion = {
          text: 'cat question child',
          questionType: 3,
          id: 4,
          parentId: 3,
          positionInParent: 0,
          isCategoryQuestion: true,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }

        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/4')
        .reply(200, [
          { schemeQuestionId: 4, categoryId: 10, id: 1000, codedAnswers: [] },
          { schemeQuestionId: 4, categoryId: 20, id: 2000, codedAnswers: [] }
        ])

        mock.onGet('/projects/1/scheme/4').reply(200, updatedCatChildQuestion)

        const store = setupStore({ ...currentState, selectedCategory: 0 })
        store.dispatch({
          type: types.GET_NEXT_QUESTION,
          id: 4,
          newIndex: 3,
          projectId: 1,
          jurisdictionId: 1,
          page: 'coding'
        })

        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.GET_NEXT_QUESTION,
            id: 4,
            newIndex: 3,
            projectId: 1,
            jurisdictionId: 1,
            page: 'coding',
            questionInfo: {
              index: 3,
              categories: [
                {
                  id: 10,
                  order: 2,
                  text: 'category 2'
                },
                {
                  id: 20,
                  order: 3,
                  text: 'category 3'
                }
              ],
              question: schemeById[4],
              selectedCategory: 0,
              selectedCategoryId: 10
            },
            userId: 1
          })

          // Should get the correct next question and should update from the api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            ...schemeById[4],
            ...updatedCatChildQuestion
          })

          expect(store.actions[1]).toHaveProperty('payload.updatedState.categories', [
            { id: 10, text: 'category 2', order: 2 }, { id: 20, text: 'category 3', order: 3 }
          ])

          done()
        })
      })

      test('should handle if next question is category child and no categories have been selected', done => {
        const currentState = {
          question: schemeById[3],
          outline: schemeOutline,
          scheme: {
            byId: schemeById,
            order: schemeOrder,
            tree: []
          },
          userAnswers: {},
          currentIndex: 2
        }

        const questionCodedAnswers = { schemeQuestionId: 5, id: 200, codedAnswers: [], flag: null, comment: '' }

        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/5').reply(200, questionCodedAnswers)
        mock.onGet('/projects/1/scheme/5').reply(200, schemeById[5])

        const store = setupStore({ ...currentState, selectedCategory: undefined, selectedCategoryId: undefined })
        store.dispatch({
          type: types.GET_NEXT_QUESTION,
          id: 4,
          newIndex: 3,
          projectId: 1,
          jurisdictionId: 1,
          page: 'coding'
        })

        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.GET_NEXT_QUESTION,
            id: 4,
            newIndex: 3,
            projectId: 1,
            jurisdictionId: 1,
            questionInfo: {
              categories: undefined,
              selectedCategoryId: null,
              selectedCategory: 0,
              index: 4,
              question: schemeById[5]
            },
            userId: 1,
            page: 'coding'
          })
          done()
        })
      })
    })
  })
})
