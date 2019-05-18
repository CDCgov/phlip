import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance, projectApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'

describe('Document Management logic', () => {
  let mock, apiMock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: {
        data: {
          jurisdictions: {
            byId: {
              1: { name: 'jur1' }
            }
          },
          projects: {
            byId: {
              1: { name: 'project1' }
            }
          }
        },
        scenes: {
          docManage: {
            main: {
              documents: {
                byId: {
                  1: {
                    name: 'Doc 1',
                    uploadedBy: { firstName: 'test', lastName: 'user' },
                    projects: [2,1],
                    jurisdictions: [1],
                    _id: 1,
                    jurisdictionList: 'Ohio',
                    projectList: 'Project2|Project1'
                  },
                  2: {
                    name: 'Doc 2',
                    uploadedBy: { firstName: 'test', lastName: 'user' },
                    projects: [1,2],
                    jurisdictions: [1],
                    _id: 2,
                    jurisdictionList: 'Ohio',
                    projectList: 'Project1|Project2'
                  }
                }
              }
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }

  test('should get document list and dispatch GET_DOCUMENTS_SUCCESS on success', (done) => {
    mock.onGet('/docs').reply(200, [
      { name: 'Doc 1', uploadedBy: { firstName: 'test', lastName: 'user' }, projects: [1], jurisdictions: [1] },
      { name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' }, projects: [1], jurisdictions: [1] }
    ])

    apiMock.onGet('/projects/1').reply(200, { name: 'Test Project', id: 1 })

    apiMock.onGet('/jurisdictions/1').reply(200, { id: 1, name: 'Ohio' })

    const store = setupStore()
    store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENTS_REQUEST },
        {
          type: types.GET_DOCUMENTS_SUCCESS,
          payload: [
            {
              name: 'Doc 1',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user',
              projects: [1],
              jurisdictions: [1],
              jurisdictionList: 'jur1',
              projectList: 'project1'
            },
            {
              name: 'Doc 2',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user',
              projects: [1],
              jurisdictions: [1],
              jurisdictionList: 'jur1',
              projectList: 'project1'
            }
          ]
        }
      ])
      done()
    })
  })

  test('should get document list and dispatch GET_DOCUMENTS_FAIL on failure', (done) => {
    mock.onGet('/docs').reply(500)

    const store = setupStore()

    store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENTS_REQUEST },
        {
          type: types.GET_DOCUMENTS_FAIL,
          payload: 'Failed to get documents'
        }
      ])
      done()
    })
  })

  test('should delete selected documents and dispatch BULK_DELETE_SUCCESS on success', done => {
    mock.onPost('/docs/bulkDelete').reply(200, { n: 2, ok: 1 })
    apiMock.onDelete('/cleanup/1/annotations').reply(200, {})
    const store = setupStore([
      {
        name: 'Doc 1',
        uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1]
      },
      {
        name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1]
      }
    ])

    store.dispatch({ type: types.BULK_DELETE_REQUEST, selectedDocs:['1','2'] })

    store.whenComplete(() => {
      expect(store.actions[1]).toEqual({ type: types.BULK_DELETE_SUCCESS, payload: { n: 2, ok: 1 } })
      done()
    })
  })

  test('should update jurisdiction of selected documents and dispatch BULK_UPDATE_SUCCESS on success', done => {
    mock.onPost('/docs/bulkUpdate').reply(
      200,
      [
        {
          name: 'Doc 1',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1]
        },
        {
          name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1]
        }
      ]
    )

    const store = setupStore([
      {
        name: 'Doc 1',
        uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1],
        status: 'Draft'
      },
      {
        name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1],
        status: 'Draft'
      }
    ])

    store.dispatch({
      type: types.BULK_UPDATE_REQUEST,
      updateData: {
        updateType: 'jurisdictions',
        updateProJur: { id: 1, name: 'Ohio' }
      },
      selectedDocs: [
        '1', '2'
      ]
    })
    store.whenComplete(() => {
      expect(store.actions[2]).toEqual({
        type: types.BULK_UPDATE_SUCCESS,
        payload: {
          '1': {
            '_id': 1,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 1',
            'projectList': 'Project2|Project1',
            'projects': [2,1],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' }
          },
          '2': {
            '_id': 2,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 2',
            'projectList': 'Project1|Project2',
            'projects': [1,2],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' }
          }
        }
      })
      done()
    })
  })

  test('should update status of selected documents and dispatch BULK_UPDATE_SUCCESS on success', done => {
    mock.onPost('/docs/bulkUpdate').reply(
      200,
      [
        {
          name: 'Doc 1',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1],
          status: 'Approved'
        },
        {
          name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1],
          status: 'Approved'
        }
      ]
    )

    const store = setupStore([
      {
        name: 'Doc 1',
        uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1],
        status: 'Draft'
      },
      {
        name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1], jurisdictions: [1],
        status: 'Draft'
      }
    ])

    store.dispatch({
      type: types.BULK_UPDATE_REQUEST,
      updateData: {
        updateType: 'status'
      },
      selectedDocs: [
        '1', '2'
      ]
    })
    store.whenComplete(() => {
      expect(store.actions[1]).toEqual({
        type: types.BULK_UPDATE_SUCCESS,
        payload: {
          '1': {
            '_id': 1,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 1',
            'projectList': 'Project2|Project1',
            'projects': [2,1],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' },
            'status' : 'Approved'
          },
          '2': {
            '_id': 2,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 2',
            'projectList': 'Project1|Project2',
            'projects': [1,2],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' },
            'status' : 'Approved'
          }
        }
      })
      done()
    })
  })

  test('should remove project id if exist from documents and dispatch CLEAN_PROJECT_SUCCESS on success', done => {
    mock.onPut('/docs/cleanProjectList/1').reply(200,{ n: 2, ok: 1 })

    const store = setupStore([
      {
        name: 'Doc 4',
        uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [2,1], jurisdictions: [1],
        projectList: 'Project2|Project1',
        status: 'Draft'
      },
      {
        name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
        projects: [1,2], jurisdictions: [1],
        projectList: 'Project1|Project2',
        status: 'Draft'
      }
    ])

    store.dispatch({
      type: types.CLEAN_PROJECT_LIST_REQUEST,
      projectMeta: {
        id: 1,
        name: 'Project1'
      }
    })
    store.whenComplete(() => {

      expect(store.actions[2]).toEqual({
        type: types.CLEAN_PROJECT_LIST_SUCCESS,
        payload: {
          '1': {
            '_id': 1,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 1',
            'projectList': 'Project2',
            'projects': [2],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' }
          },
          '2': {
            '_id': 2,
            'jurisdictionList': 'Ohio',
            'jurisdictions': [1],
            'name': 'Doc 2',
            'projectList': 'Project2',
            'projects': [2],
            'uploadedBy': { 'firstName': 'test', 'lastName': 'user' }
          }
        }
      })
      done()
    })
  })
})
