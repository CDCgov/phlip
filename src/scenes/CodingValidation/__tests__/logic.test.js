import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import { INITIAL_STATE } from 'data/users/reducer'
import createApiHandler, { projectApiInstance } from 'services/api'
import { INITIAL_STATE as initialCoding } from '../reducer'
import { default as reducer } from 'reducer'
import apiCalls from 'services/api/calls'
import {
  schemeFromApi,
  schemeOutline,
  schemeById,
  schemeTree,
  schemeOrder,
  userAnswersCoded,
  userCodedQuestions,
  userValidatedQuestions,
  userAnswersValidation,
  schemeUserAnswersEmpty,
  schemeTreeAfterInitialization
} from 'utils/testData/coding'

let history = {}, mock = {}

const mockReducer = state => state
const api = createApiHandler({ history }, projectApiInstance, apiCalls)

const setupStore = (currentState = {}, reducerFn = mockReducer) => {
  return createMockStore({
    initialState: {
      data: {
        user: {
          ...INITIAL_STATE, currentUser: {
            id: 1, firstName: 'Test', lastName: 'User', avatar: ''
          }, byId: {
            1: { id: 1 }
          }
        }
      }, scenes: {
        codingValidation: {
          coding: {
            ...initialCoding, ...currentState
          }
        }, home: {
          main: {
            searchValue: '', projects: {
              byId: {
                4: {
                  id: 4, name: 'p4', lastEditedBy: '', dateLastEdited: new Date(10, 10, 2010)
                }
              }
            }
          }
        }
      }
    }, reducer: reducerFn, logic, injectedDeps: { api }
  })
}

describe('CodingValidation logic', () => {
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  describe('SAVE_USER_ANSWER_REQUEST logic', () => {
    describe('when there are unsaved changes in state', () => {
      test('should add request to queue if a POST request is in progress for question', done => {
        const store = setupStore({
          unsavedChanges: true, scheme: { byId: schemeById, tree: [], outline: {} }, userAnswers: {
            ...schemeUserAnswersEmpty, 1: {
              answers: { ...userAnswersCoded[1] }, flag: { type: 0 }, isNewCodedQuestion: true, hasMadePost: true
            }
          }, messageQueue: []
        })
        
        mock.onPut('/users/1/projects/4/jurisdictions/32/codedquestions/1')
          .reply(config => {
            return userCodedQuestions[1]
          })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].type).toEqual(types.ADD_REQUEST_TO_QUEUE)
          done()
        })
      })
      
      test('should allow the request if there is not a POST request in progress', done => {
        const store = setupStore({
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: {} },
          userAnswers: { ...userAnswersCoded },
          messageQueue: []
        })
        
        mock.onPut('/users/1/projects/4/jurisdictions/32/codedquestions/1')
          .reply(config => {
            return userCodedQuestions[1]
          })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].type)
            .toEqual(types.SAVE_USER_ANSWER_REQUEST)
          done()
        })
      })
      
      test('should dispatch SAVE_USER_ANSWER_SUCCESS when requests are successful', done => {
        const store = setupStore({
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: {} },
          userAnswers: { ...userAnswersCoded },
          messageQueue: []
        })
        
        mock.onPut('/users/1/projects/4/jurisdictions/32/codedquestions/1')
          .reply(200, userCodedQuestions[1])
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(store.actions[2].type)
            .toEqual(types.SAVE_USER_ANSWER_SUCCESS)
          done()
        })
      })
      
      test('should dispatch REMOVE_REQUEST_FROM_QUEUE if question is not a new coded question', done => {
        const store = setupStore({
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: {} },
          userAnswers: { ...userAnswersCoded },
          messageQueue: []
        })
        
        mock.onPut('/users/1/projects/4/jurisdictions/32/codedquestions/1')
          .reply(200, userCodedQuestions[1])
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.REMOVE_REQUEST_FROM_QUEUE)
          done()
        })
      })
    })
    
    describe('when state.page === coding', () => {
      test('should use coding create api if question is a new coded question', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        const spy = jest.spyOn(api, 'answerCodedQuestion')
        
        const store = setupStore({
          page: 'coding', unsavedChanges: true, scheme: { byId: schemeById, tree: [], outline: {} }, userAnswers: {
            ...schemeUserAnswersEmpty, 1: {
              answers: { ...userAnswersCoded[1] }, flag: { type: 0 }, isNewCodedQuestion: true, hasMadePost: false
            }
          }, messageQueue: []
        })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalled()
          done()
        })
      })
      
      test('should use validation update api if question is not a new coded question', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        const spy = jest.spyOn(api, 'updateCodedQuestion')
        
        const store = setupStore({
          page: 'coding',
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: [] },
          userAnswers: { ...userAnswersCoded },
          messageQueue: []
        })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalled()
          done()
        })
      })
    })
    
    describe('when state.page === validation', () => {
      test('should use validation create api if question is a new coded question', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        const spy = jest.spyOn(api, 'answerValidatedQuestion')
        
        const store = setupStore({
          page: 'validation',
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: {} },
          userAnswers: {
            ...schemeUserAnswersEmpty, 1: {
              answers: { ...userAnswersCoded[1] }, flag: { type: 0 }, isNewCodedQuestion: true, hasMadePost: false
            }
          },
          messageQueue: []
        })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalled()
          done()
        })
      })
      
      test('should use validation update api if question is not a new coded question', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        const spy = jest.spyOn(api, 'updateValidatedQuestion')
        
        const store = setupStore({
          page: 'validation',
          unsavedChanges: true,
          scheme: { byId: schemeById, tree: [], outline: [] },
          userAnswers: { ...userAnswersCoded },
          messageQueue: []
        })
        
        store.dispatch({
          type: types.SAVE_USER_ANSWER_REQUEST,
          projectId: 4,
          jurisdictionId: 32,
          selectedCategoryId: null,
          questionId: 1
        })
        
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalled()
          done()
        })
      })
    })
  })
  
  describe('GET_CODING_OUTLINE logic', () => {
    describe('when a coding scheme exists and calls are successful', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        const codedQuestions = userCodedQuestions
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions')
          .reply(200, codedQuestions)
        store.dispatch({
          type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_CODING_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_CODING_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should initialize scheme.byId', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.scheme.byId).toEqual(schemeById)
          done()
        })
      })
      
      test('should set scheme outline', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.outline).toEqual(schemeOutline)
          done()
        })
      })
      
      test('should initialize scheme order', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.scheme.order).toEqual(schemeOrder)
          done()
        })
      })
      
      test('should call the api to get coded questions', done => {
        const userAnswers = userAnswersCoded
        store.whenComplete(() => {
          expect(store.actions[1].payload.userAnswers).toEqual(userAnswers)
          done()
        })
      })
      
      test('should initialize scheme.tree', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.scheme.tree).toEqual(schemeTree)
          done()
        })
      })
    })
    
    describe('when the scheme is empty', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: [], outline: {}
        })
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions')
          .reply(200, [])
        store.dispatch({
          type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_CODING_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_CODING_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should return the scheme is empty if the scheme from the api is empty', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.isSchemeEmpty).toEqual(true)
          done()
        })
      })
    })
    
    describe('when jurisdictions are empty and scheme is not', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions')
          .reply(200, userCodedQuestions)
        store.dispatch({
          type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: null
        })
      })
      
      test('should dispatch GET_CODING_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_CODING_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should return without initializing userAnswers', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.userAnswers).toEqual({})
          done()
        })
      })
    })
    
    describe('when api scheme api request fails', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(500)
        
        const codedQuestions = userCodedQuestions
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions')
          .reply(200, codedQuestions)
        store.dispatch({
          type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_CODING_OUTLINE_FAIL', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.GET_CODING_OUTLINE_FAIL)
          done()
        })
      })
      
      test('should return an error string', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload).toEqual('Failed to get outline.')
          expect(store.actions[1].error).toEqual(true)
          done()
        })
      })
    })
    
    describe('when coded questions api request fails', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions')
          .reply(500)
        store.dispatch({
          type: types.GET_CODING_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_CODING_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_CODING_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should set payload.error.coderValQuestions to error string', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.errors.codedValQuestions)
            .toEqual(
              'We couldn\'t get your answered questions for this project and jurisdiction, so you are not able to answer questions.'
            )
          done()
        })
      })
    })
  })
  
  describe('GET_VALIDATION_OUTLINE logic', () => {
    describe('when a coding scheme exists and calls are successful', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/api/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/projects/1/jurisdictions/1/codedquestions/1')
          .reply(200, [])
        mock.onGet('/projects/1/jurisdictions/1/validatedquestions')
          .reply(200, userValidatedQuestions)
        mock.onGet('/users/1/avatar').reply(200, '')
        mock.onGet('/users/2/avatar').reply(200, '')
        
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_VALIDATION_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[2].type)
            .toEqual(types.GET_VALIDATION_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should initialize scheme.byId', done => {
        store.whenComplete(() => {
          expect(store.actions[2].payload.scheme.byId).toEqual(schemeById)
          done()
        })
      })
      
      test('should set scheme outline', done => {
        store.whenComplete(() => {
          expect(store.actions[2].payload.outline).toEqual(schemeOutline)
          done()
        })
      })
      
      test('should initialize scheme order', done => {
        store.whenComplete(() => {
          expect(store.actions[2].payload.scheme.order).toEqual(schemeOrder)
          done()
        })
      })
      
      test('should call the api to get validated questions', done => {
        store.whenComplete(() => {
          expect(store.actions[2].payload.userAnswers)
            .toEqual(userAnswersValidation)
          done()
        })
      })
      
      test('should initialize scheme.tree', done => {
        store.whenComplete(() => {
          expect(store.actions[2].payload.scheme.tree).toEqual(schemeTree)
          done()
        })
      })
    })
    
    describe('when the scheme is empty', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: [], outline: {}
        })
        
        mock.onGet('/projects/1/jurisdictions/1/validatedquestions')
          .reply(200, [])
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_VALIDATION_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_VALIDATION_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should return the scheme is empty if the scheme from the api is empty', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.isSchemeEmpty).toEqual(true)
          done()
        })
      })
    })
    
    describe('when jurisdictions are empty and scheme is not', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/projects/1/jurisdictions/1/codedquestions/1')
          .reply(200, [])
        mock.onGet('/projects/1/jurisdictions/1/validatedquetions')
          .reply(200, userValidatedQuestions)
        mock.onGet('/users/1/avatar').reply(200, '')
        mock.onGet('/users/2/avatar').reply(200, '')
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: null
        })
      })
      
      test('should dispatch GET_VALIDATION_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_VALIDATION_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should return without initializing userAnswers', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.userAnswers).toEqual({})
          done()
        })
      })
    })
    
    describe('when api scheme api request fails', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(500)
        
        mock.onGet('/projects/1/jurisdictions/1/codedquestions/1')
          .reply(200, [])
        mock.onGet('/projects/1/jurisdictions/1/validatedquetions')
          .reply(200, userValidatedQuestions)
        mock.onGet('/users/1/avatar').reply(200, '')
        mock.onGet('/users/2/avatar').reply(200, '')
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_VALIDATION_OUTLINE_FAIL', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_VALIDATION_OUTLINE_FAIL)
          done()
        })
      })
      
      test('should return an error string', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload).toEqual('Couldn\'t get outline')
          expect(store.actions[1].error).toEqual(true)
          done()
        })
      })
    })
    
    describe('when validated questions api request fails', () => {
      const store = setupStore()
      
      beforeEach(() => {
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/projects/1/jurisdictions/1/codedquestions/1')
          .reply(200, [])
        mock.onGet('/users/1/avatar').reply(200, '')
        mock.onGet('/users/2/avatar').reply(200, '')
        mock.onGet('/projects/1/jurisdictions/1/validationquestions').reply(500)
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should dispatch GET_VALIDATION_OUTLINE_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type)
            .toEqual(types.GET_VALIDATION_OUTLINE_SUCCESS)
          done()
        })
      })
      
      test('should set payload.error.coderValQuestions to error string', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.errors.codedValQuestions)
            .toEqual(
              'We couldn\'t get your answered questions for this project and jurisdiction, so you are not able to answer questions.'
            )
          done()
        })
      })
    })
    
    describe('when flags exist in the first question', () => {
      const store = setupStore({}, reducer)
      
      beforeEach(() => {
        const questions = schemeFromApi
        questions[0] = {
          ...schemeFromApi[0], flags: [
            {
              raisedBy: {
                userId: 3, firstName: 'test', lastName: 'user3'
              }
            }]
        }
        
        mock.onGet('/projects/1/scheme').reply(200, {
          schemeQuestions: schemeFromApi, outline: schemeOutline
        })
        
        mock.onGet('/projects/1/jurisdictions/1/codedquestions/1')
          .reply(200, [])
        mock.onGet('/users/1/avatar').reply(200, '')
        mock.onGet('/users/2/avatar').reply(200, '')
        mock.onGet('/users/3/avatar').reply(200, '')
        mock.onGet('/projects/1/jurisdictions/1/validationquestions').reply(500)
        store.dispatch({
          type: types.GET_VALIDATION_OUTLINE_REQUEST, projectId: 1, jurisdictionId: 1
        })
      })
      
      test('should add the flag raiser to users state', done => {
        store.whenComplete(() => {
          const usersState = store.getState().data.user
          expect(usersState.byId.hasOwnProperty('3')).toEqual(true)
          done()
        })
      })
    })
  })
  
  describe('ON_APPLY_ANSWER_TO_ALL logic', () => {
    describe('when state.page === coding', () => {
      let answer, update
      
      beforeAll(() => {
        answer = api.answerCodedQuestion
        update = api.updateCodedQuestion
        api.answerCodedQuestion = jest.fn(() => 'create coded question')
        api.updateCodedQuestion = jest.fn(() => 'update coded question')
      })
      
      afterAll(() => {
        api.answerCodedQuestion = answer
        api.updateCodedQuestion = update
      })
      
      const store = setupStore({
        scheme: { byId: schemeById, tree: [] },
        outline: schemeOutline,
        page: 'coding',
        userAnswers: userAnswersCoded,
        selectedCategoryId: 10
      }, state => state)
      
      test('should use coding api methods', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].apiMethods.create())
            .toEqual('create coded question')
          expect(store.actions[0].apiMethods.update())
            .toEqual('update coded question')
          done()
        })
      })
      
      test('should set action.isValidation to false', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].isValidation).toEqual(false)
          done()
        })
      })
      
      test('should set action.otherUpdates to {}', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].otherUpdates).toEqual({})
          done()
        })
      })
    })
    
    describe('when state.page === validation', () => {
      let answer, update
      
      beforeAll(() => {
        answer = api.answerValidatedQuestion
        update = api.updateValidatedQuestion
        api.answerValidatedQuestion = jest.fn(() => 'create validated question')
        api.updateValidatedQuestion = jest.fn(() => 'update validated question')
      })
      
      afterAll(() => {
        api.answerValidatedQuestion = answer
        api.updateValidatedQuestion = update
      })
      
      const store = setupStore({
        scheme: { byId: schemeById, tree: [] },
        outline: schemeOutline,
        page: 'validation',
        userAnswers: { ...userAnswersCoded },
        selectedCategoryId: 10
      }, state => state)
      
      test('should use validation api methods', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].apiMethods.create())
            .toEqual('create validated question')
          expect(store.actions[0].apiMethods.update())
            .toEqual('update validated question')
          done()
        })
      })
      
      test('should set action.isValidation to true', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].isValidation).toEqual(true)
          done()
        })
      })
      
      test('should set action.otherUpdates.validatedBy to the current user in state', done => {
        mock.onAny().reply(config => {
          return [200, config.url]
        })
        
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].otherUpdates).toEqual({
            validatedBy: {
              userId: 1, firstName: 'Test', lastName: 'User', avatar: ''
            }
          })
          done()
        })
      })
    })
    
    describe('when api calls are successful', () => {
      const store = setupStore({
        scheme: { byId: schemeById, tree: [] },
        outline: schemeOutline,
        page: 'coding',
        userAnswers: { ...userAnswersCoded },
        selectedCategoryId: 10
      }, state => state)
      
      beforeEach(() => {
        mock.onPut('/users/1/projects/4/jurisdictions/1/codedquestions/4')
          .reply(200, userAnswersCoded[4])
        mock.onPost('/users/1/projects/4/jurisdictions/1/codedquestions/4')
          .reply(200, userAnswersCoded[4])
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
      })
      
      test('should dispatch SAVE_USER_ANSWER_SUCCESS', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.SAVE_USER_ANSWER_SUCCESS)
          done()
        })
      })
      
      test('should set payload to response from api', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload).toEqual({
            ...userAnswersCoded[4], questionId: 4, selectedCategoryId: 10
          })
          done()
        })
      })
    })
    
    describe('when api calls fail', () => {
      const store = setupStore({
        scheme: { byId: schemeById, tree: [] },
        outline: schemeOutline,
        page: 'coding',
        userAnswers: userAnswersCoded,
        selectedCategoryId: 10
      }, state => state)
      
      beforeEach(() => {
        mock.onPut('/users/1/projects/4/jurisdictions/1/codedquestions/4')
          .reply(500)
        mock.onPost('/users/1/projects/4/jurisdictions/1/codedquestions/4')
          .reply(500)
        store.dispatch({
          type: types.ON_APPLY_ANSWER_TO_ALL, projectId: 4, jurisdictionId: 1, questionId: 4
        })
      })
      
      test('should dispatch SAVE_USER_ANSWER_FAIL', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.SAVE_USER_ANSWER_FAIL)
          done()
        })
      })
      
      test('should set payload.error to Could not update answer', done => {
        store.whenComplete(() => {
          expect(store.actions[1].payload.error)
            .toEqual('Could not update answer')
          done()
        })
      })
    })
  })
  
  describe('GET_NEXT_QUESTION logic', () => {
    const currentState = {
      question: schemeById[1], outline: schemeOutline, scheme: {
        byId: schemeById, order: schemeOrder, tree: schemeTree
      }, userAnswers: { ...userAnswersCoded }, errors: {}
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
          possibleAnswers: [
            { id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }
        
        const question2CodedAnswers = {
          schemeQuestionId: 2, id: 200, codedAnswers: [], flag: null, comment: ''
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/2')
          .reply(200, question2CodedAnswers)
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
            type: types.GET_NEXT_QUESTION, id: 2, newIndex: 1, projectId: 1, jurisdictionId: 1, questionInfo: {
              categories: undefined, selectedCategory: 0, selectedCategoryId: null, index: 1, question: schemeById[2]
            }, userId: 1, page: 'coding'
          })
          
          // Should get the correct next question and should update from the
          // api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            ...schemeById[2], ...questionInfo
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
          possibleAnswers: [
            { id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/4')
          .reply(200, [
            {
              schemeQuestionId: 4, categoryId: 10, id: 1000, codedAnswers: []
            }, {
              schemeQuestionId: 4, categoryId: 20, id: 2000, codedAnswers: []
            }])
        
        mock.onGet('/projects/1/scheme/4').reply(200, updatedCatChildQuestion)
        
        const store = setupStore({ ...currentState, selectedCategory: 0 })
        store.dispatch({
          type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1, page: 'coding'
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
              index: 3, categories: [
                {
                  id: 10, order: 2, text: 'category 2'
                }, {
                  id: 20, order: 3, text: 'category 3'
                }], question: schemeById[4], selectedCategory: 0, selectedCategoryId: 10
            },
            userId: 1
          })
          
          // Should get the correct next question and should update from the
          // api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            ...schemeById[4], ...updatedCatChildQuestion
          })
          
          expect(store.actions[1])
            .toHaveProperty('payload.updatedState.categories', [
              { id: 10, text: 'category 2', order: 2 }, { id: 20, text: 'category 3', order: 3 }])
          
          done()
        })
      })
      
      test('should handle if next question is category child and no categories have been selected', done => {
        const currentState = {
          question: schemeById[3], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: []
          }, userAnswers: {}, currentIndex: 2
        }
        
        const questionCodedAnswers = {
          schemeQuestionId: 5, id: 200, codedAnswers: [], flag: null, comment: ''
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/5')
          .reply(200, questionCodedAnswers)
        mock.onGet('/projects/1/scheme/5').reply(200, schemeById[5])
        
        const store = setupStore({
          ...currentState, selectedCategory: undefined, selectedCategoryId: undefined
        })
        store.dispatch({
          type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1, page: 'coding'
        })
        
        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1, questionInfo: {
              categories: undefined, selectedCategoryId: null, selectedCategory: 0, index: 4, question: schemeById[5]
            }, userId: 1, page: 'coding'
          })
          done()
        })
      })
      
      test('should dispatch GET_QUESTION_SUCCESS when all api calls are successful', done => {
        const currentState = {
          question: schemeById[3], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: []
          }, userAnswers: {}, currentIndex: 2, page: 'coding'
        }
        
        const questionCodedAnswers = {
          schemeQuestionId: 5, id: 200, codedAnswers: [], flag: null, comment: ''
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/5')
          .reply(200, questionCodedAnswers)
        mock.onGet('/projects/1/scheme/5').reply(200, schemeById[5])
        
        const store = setupStore({
          ...currentState, selectedCategory: undefined, selectedCategoryId: undefined
        })
        store.dispatch({
          type: types.GET_NEXT_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1, page: 'coding'
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.GET_QUESTION_SUCCESS)
          done()
        })
      })
    })
  })
  
  describe('GET_PREV_QUESTION logic', () => {
    describe('should GET_PREV_QUESTION based on action and state information', () => {
      test('should handle regular questions', done => {
        const currentState = {
          question: schemeById[3], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: schemeTree
          }, userAnswers: { ...userAnswersCoded }, errors: {}
        }
        
        const questionInfo = {
          text: 'la la la updated',
          questionType: 3,
          id: 2,
          hint: '',
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [
            { id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }
        
        const question2CodedAnswers = {
          schemeQuestionId: 2, id: 200, codedAnswers: [], flag: null, comment: ''
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/2')
          .reply(200, question2CodedAnswers)
        mock.onGet('/projects/1/scheme/2').reply(200, questionInfo)
        
        const store = setupStore(currentState)
        store.dispatch({
          type: types.GET_PREV_QUESTION, id: 2, newIndex: 1, projectId: 1, jurisdictionId: 1, userId: 1, page: 'coding'
        })
        
        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.GET_PREV_QUESTION, id: 2, newIndex: 1, projectId: 1, jurisdictionId: 1, questionInfo: {
              categories: undefined, selectedCategory: 0, selectedCategoryId: null, index: 1, question: schemeById[2]
            }, userId: 1, page: 'coding'
          })
          
          // Should get the correct next question and should update from the
          // api response
          expect(store.actions[1]).toHaveProperty('payload.question', {
            ...schemeById[2], ...questionInfo
          })
          done()
        })
      })
      
      test(
        'should get parent question if next previous question is a category question, but the parent question is unanswered',
        done => {
          const currentState = {
            question: schemeById[5], outline: schemeOutline, scheme: {
              byId: schemeById, order: schemeOrder, tree: schemeTree
            }, currentIndex: 4, userAnswers: { ...schemeUserAnswersEmpty }, errors: {}
          }
          
          const questionInfo = { ...schemeById[3] }
          const question2CodedAnswers = {
            schemeQuestionId: 3, id: 200, codedAnswers: [], flag: null, comment: ''
          }
          
          mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/3')
            .reply(200, question2CodedAnswers)
          mock.onGet('/projects/1/scheme/3').reply(200, questionInfo)
          
          const store = setupStore(currentState)
          store.dispatch({
            type: types.GET_PREV_QUESTION,
            id: 4,
            newIndex: 4,
            projectId: 1,
            jurisdictionId: 1,
            userId: 1,
            page: 'coding'
          })
          
          store.whenComplete(() => {
            expect(store.actions[0]).toEqual({
              type: types.GET_PREV_QUESTION, id: 4, newIndex: 4, projectId: 1, jurisdictionId: 1, questionInfo: {
                categories: undefined, selectedCategory: 0, selectedCategoryId: null, index: 2, question: schemeById[3]
              }, userId: 1, page: 'coding'
            })
            
            // Should get the correct next question and should update from
            // the api response
            expect(store.actions[1]).toHaveProperty('payload.question', {
              ...schemeById[3], ...questionInfo
            })
            done()
          })
        }
      )
      
      test(
        'should get category question if next previous question is a category question and parent question is answered',
        done => {
          const currentState = {
            question: schemeById[5], outline: schemeOutline, scheme: {
              byId: schemeById, order: schemeOrder, tree: schemeTree
            }, currentIndex: 4, userAnswers: { ...userAnswersCoded }, errors: {}
          }
          
          mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/4')
            .reply(200, [
              {
                schemeQuestionId: 4, categoryId: 10, id: 1000, codedAnswers: []
              }, {
                schemeQuestionId: 4, categoryId: 20, id: 2000, codedAnswers: []
              }])
          mock.onGet('/projects/1/scheme/4').reply(200, schemeFromApi[3])
          
          const store = setupStore(currentState)
          store.dispatch({
            type: types.GET_PREV_QUESTION,
            id: 4,
            newIndex: 3,
            projectId: 1,
            jurisdictionId: 1,
            userId: 1,
            page: 'coding'
          })
          
          store.whenComplete(() => {
            expect(store.actions[0]).toEqual({
              type: types.GET_PREV_QUESTION, id: 4, newIndex: 3, projectId: 1, jurisdictionId: 1, questionInfo: {
                categories: [
                  {
                    id: 10, order: 2, text: 'category 2'
                  }, {
                    id: 20, order: 3, text: 'category 3'
                  }], selectedCategory: 0, selectedCategoryId: 10, index: 3, question: schemeById[4]
              }, userId: 1, page: 'coding'
            })
            
            // Should get the correct next question and should update from
            // the api response
            expect(store.actions[1]).toHaveProperty('payload.question', {
              ...schemeById[4]
            })
            done()
          })
        }
      )
    })
  })
  
  describe('ON_QUESTION_SELECTED_IN_NAV', () => {
    describe('should get question selected in navigator based on action and state information', () => {
      test('should handle regular questions', done => {
        const currentState = {
          question: schemeById[3], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: schemeTree
          }, userAnswers: { ...userAnswersCoded }, errors: {}
        }
        
        mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/3')
          .reply(200, userCodedQuestions[2])
        mock.onGet('/projects/1/scheme/3').reply(200, schemeFromApi[2])
        
        const store = setupStore(currentState)
        store.dispatch({
          type: types.ON_QUESTION_SELECTED_IN_NAV,
          question: { ...schemeTree[2] },
          projectId: 1,
          jurisdictionId: 1,
          page: 'coding'
        })
        
        store.whenComplete(() => {
          expect(store.actions[0]).toEqual({
            type: types.ON_QUESTION_SELECTED_IN_NAV,
            question: schemeTree[2],
            projectId: 1,
            jurisdictionId: 1,
            questionInfo: {
              categories: undefined, selectedCategory: 0, selectedCategoryId: null, index: 2, question: schemeById[3]
            },
            userId: 1,
            page: 'coding'
          })
          
          // Should get the correct next question and should update from the
          // api response
          expect(store.actions[1])
            .toHaveProperty('payload.question', schemeById[3])
          done()
        })
      })
      
      describe('when a category question is selected', () => {
        const currentState = {
          question: schemeById[3], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: schemeTree
          }, userAnswers: { ...userAnswersCoded }, errors: {}
        }
        const store = setupStore(currentState)
        
        beforeEach(() => {
          mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/4')
            .reply(200, userCodedQuestions[3])
          mock.onGet('/projects/1/scheme/4').reply(200, schemeFromApi[3])
          
          store.dispatch({
            type: types.ON_QUESTION_SELECTED_IN_NAV,
            question: schemeTree[2].children[0],
            projectId: 1,
            jurisdictionId: 1,
            page: 'coding'
          })
        })
        
        test(
          'should update actions[0].questionInfo with the question from scheme based on action.payload.question.id',
          done => {
            store.whenComplete(() => {
              expect(store.actions[0].questionInfo).toEqual({
                categories: [
                  { id: 10, order: 2, text: 'category 2' }, { id: 20, order: 3, text: 'category 3' }],
                selectedCategory: 0,
                selectedCategoryId: 10,
                index: 3,
                question: schemeById[4]
              })
              
              done()
            })
          }
        )
        
        test('should return action.payload.question with the correct question', done => {
          store.whenComplete(() => {
            expect(store.actions[1])
              .toHaveProperty('payload.question', schemeById[4])
            done()
          })
        })
      })
      
      describe('when a category is selected', () => {
        const currentState = {
          question: schemeById[2], outline: schemeOutline, scheme: {
            byId: schemeById, order: schemeOrder, tree: schemeTree
          }, userAnswers: { ...userAnswersCoded }, errors: {}
        }
        const store = setupStore(currentState)
        
        beforeEach(() => {
          mock.onGet('/users/1/projects/1/jurisdictions/1/codedquestions/4')
            .reply(200, userCodedQuestions[3])
          mock.onGet('/projects/1/scheme/4').reply(200, schemeFromApi[3])
          
          store.dispatch({
            type: types.ON_QUESTION_SELECTED_IN_NAV, question: {
              ...schemeTreeAfterInitialization[2].children[0].children[1], treeIndex: 1
            }, projectId: 1, jurisdictionId: 1, page: 'coding'
          })
        })
        
        test(
          'should update actions[0].questionInfo with the question from scheme based on action.payload.schemeQuestionId',
          done => {
            store.whenComplete(() => {
              expect(store.actions[0].questionInfo).toEqual({
                categories: [
                  { id: 10, order: 2, text: 'category 2' }, { id: 20, order: 3, text: 'category 3' }],
                selectedCategory: 1,
                selectedCategoryId: 20,
                index: 3,
                question: schemeById[4]
              })
              
              done()
            })
          }
        )
        
        test('should return action.payload.question with the correct question', done => {
          store.whenComplete(() => {
            expect(store.actions[1])
              .toHaveProperty('payload.question', schemeById[4])
            done()
          })
        })
      })
    })
  })
})
