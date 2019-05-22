import { types } from '../actions'
import { mainReducer as reducer, INITIAL_STATE as initial } from '../reducer'
import { projects, projectsPayload, sortedByDateAndBookmarked, defaultSorted } from 'utils/testData/projectsHome'
import { types as projectTypes } from 'data/projects/actions'

const getState = (other = {}) => ({
  ...initial,
  ...other
})

const getStateWithProjects = (other = {}) => ({
  ...initial,
  projects: {
    visible: [],
    matches: []
  },
  ...other
})

xdescribe('Home reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('SET_PROJECTS', () => {
    const currentState = getState()
    const state = reducer(
      currentState,
      {
        type: projectTypes.SET_PROJECTS,
        payload: {
          projects: {
            visible: [1, 2],
            matches: []
          },
          bookmarkList: [],
          error: false,
          errorContent: '',
          searchValue: ''
        }
      }
    )
    
    test('it should set projects', () => {
      expect(state.projects).toEqual({
        visible: [1, 2],
        matches: []
      })
    })
    
    test('should set the rest of the payload items', () => {
      expect(state.bookmarkList).toEqual([])
      expect(state.error).toEqual(false)
      expect(state.errorContent).toEqual('')
      expect(state.searchValue).toEqual('')
    })
  })

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set state.bookmarkList to action.payload.bookmarkList', () => {
      const currentState = getState()
      const state = reducer(currentState, {
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: { bookmarkList: [1, 2, 3] }
      })

      expect(state.bookmarkList).toEqual([1, 2, 3])
    })

    test('should move the bookmarked project to the top half of the list if sort by bookmarks is enabled', () => {
      const state = reducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 3, 5, 2, 1]
        },
        sortBookmarked: true,
        bookmarkList: [4, 3],
        visibleProjects: [4, 3, 5, 2, 1]
      }), { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { bookmarkList: [4, 3, 2] } })

      expect(state).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 2, 3, 5, 1]
        },
        visibleProjects: [4, 2, 3, 5, 1],
        sortBookmarked: true,
        bookmarkList: [4, 3, 2],
        projectCount: 5
      }))
    })

    test('should move the un-bookmarked project from the top of the list if sort by bookmarks is enabled', () => {
      const state = reducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 2, 3, 5, 1]
        },
        sortBookmarked: true,
        bookmarkList: [4, 2, 3],
        visibleProjects: [4, 2, 3, 5, 1]
      }), { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { bookmarkList: [4, 3] } })

      expect(state).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 3, 5, 2, 1]
        },
        visibleProjects: [4, 3, 5, 2, 1],
        sortBookmarked: true,
        bookmarkList: [4, 3],
        projectCount: 5
      }))
    })

    test('should not move the project in the list if sort by bookmarked is not enabled', () => {
      const state = reducer(getStateWithProjects({ bookmarkList: [4, 3] }), {
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: { bookmarkList: [4, 3, 2] }
      })

      expect(state).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        },
        visibleProjects: [5, 4, 2, 3, 1],
        bookmarkList: [4, 3, 2],
        projectCount: 5
      }))

    })
  })

  describe('UPDATE_PROJECT_SUCCESS', () => {
    test('should update project state.project.byId', () => {
      const state = reducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        }
      }), {
        type: types.UPDATE_PROJECT_SUCCESS,
        payload: { id: 3, name: 'Updated Project', lastEditedBy: 'Last User', dateLastEdited: new Date(2017, 11, 28) }
      })

      expect(state).toEqual(getState({
        projects: {
          byId: {
            ...projects,
            3: { id: 3, name: 'Updated Project', lastEditedBy: 'Last User', dateLastEdited: new Date(2017, 11, 28) }
          },
          allIds: [3, 5, 4, 2, 1]
        },
        projectCount: 5,
        visibleProjects: [3, 5, 4, 2, 1]
      }, { goBack: true }))
    })
  })

  describe('UPDATE_PROJECT_FAIL', () => {
    test('should not add project to list of projects in state', () => {
      const currentState = getStateWithProjects()
      const state = reducer(currentState, { type: types.UPDATE_PROJECT_FAIL })

      expect(state.projectCount).toEqual(5)
      expect(Object.keys(state.projects.byId).length).toEqual(5)
    })
  })

  describe('ADD_PROJECT_SUCCESS', () => {
    test('should add the new project to the top of the project list and visible project list', () => {
      const currentState = getStateWithProjects()
      const projectPayload = { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 }

      const state = reducer(currentState, {
        type: types.ADD_PROJECT_SUCCESS,
        payload: projectPayload
      })

      expect(state.projects.byId[6]).toEqual(projectPayload)
      expect(state.visibleProjects[0]).toEqual(6)
      expect(state.projects.allIds[0]).toEqual(6)
    })

    test('should set the sortBy, direction, and sortBookmarked properties back to defaults and sort projects by defaults', () => {
      const state = reducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [1, 3, 4, 2, 5]
        },
        visibleProjects: [1, 3, 4, 2, 5],
        direction: 'asc',
        bookmarkList: [4, 3, 1],
        projectCount: 5,
        sortBookmarked: true,
        sortBy: 'dateLastEdited'
      }), {
        type: types.ADD_PROJECT_SUCCESS,
        payload: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 }
      })

      expect(state).toEqual(getState({
        projects: {
          byId: {
            6: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 },
            ...projects
          },
          allIds: [6, 5, 4, 2, 3, 1]
        },
        projectCount: 6,
        visibleProjects: [6, 5, 4, 2, 3, 1],
        sortBookmarked: false,
        direction: 'desc',
        bookmarkList: [4, 3, 1]
      }, { goBack: true }))
    })
  })

  describe('GET_PROJECTS_FAIL', () => {
    const state = reducer(getState({}), { type: types.GET_PROJECTS_FAIL })
    test('should set state.errorContent', () => {
      expect(state.errorContent).toEqual('We couldn\'t retrieve the project list. Please try again later.')
    })

    test('should set state.error to true', () => {
      expect(state.error).toEqual(true)
    })
  })

  describe('GET_PROJECTS_REQUEST', () => {
    test('shouldn\'t change anything in state', () => {
      const currentState = getState()
      const state = reducer(currentState, { type: types.GET_PROJECTS_REQUEST })
      expect(state).toEqual(initial)
    })
  })

  xdescribe('UPDATE_ROWS', () => {
    const currentState = getState({
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      },
      visibleProjects: [5, 4, 2, 3, 1],
      projectCount: 5,
      rowsPerPage: 5,
      page: 0
    })
    const state = reducer(currentState, { type: types.UPDATE_ROWS, payload: { rowsPerPage: 3 } })

    test('should set state.rowsPerPage to action.payload.rowsPerPage', () => {
      expect(state.rowsPerPage).toEqual(3)
    })

    test('should update visibleProjects', () => {
      expect(state.visibleProjects).toEqual([5, 4, 2])
    })
  })

  xdescribe('UPDATE_PAGE', () => {
    const currentState = getState({
      visibleProjects: [5, 4],
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      },
      projectCount: 5,
      rowsPerPage: 2,
      page: 0
    })
    const state = reducer(currentState, { type: types.UPDATE_PAGE, payload: { page: 1 } })

    test('should set state.page to action.payload.page', () => {
      expect(state.page).toEqual(1)
    })

    test('should update visible projects', () => {
      expect(state.visibleProjects).toEqual([2, 3])
    })
  })

  xdescribe('SORT_PROJECTS', () => {
    describe('sort by: name ascending', () => {
      const currentState = getStateWithProjects({ direction: 'desc' })
      const state = reducer(currentState, { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } })

      test('should set visible projects to [1,2,3,4,5]', () => {
        expect(state.visibleProjects).toEqual([1, 2, 3, 4, 5])
      })

      test('should set state.sortBy to name', () => {
        expect(state.sortBy).toEqual('name')
      })

      test('should set state.direction to asc', () => {
        expect(state.direction).toEqual('asc')
      })
    })

    describe('sort by: name descending', () => {
      const currentState = getStateWithProjects({ direction: 'asc' })
      const state = reducer(currentState, { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } })

      test('should set visible projects to [5, 4, 3, 2, 1]', () => {
        expect(state.visibleProjects).toEqual([5, 4, 3, 2, 1])
      })

      test('should set state.sortBy to name', () => {
        expect(state.sortBy).toEqual('name')
      })

      test('should set state.direction to desc', () => {
        expect(state.direction).toEqual('desc')
      })
    })

    describe('sort by: dateLastEdited ascending', () => {
      const currentState = getStateWithProjects({ direction: 'desc', visibleProjects: [4, 3, 2, 5, 1] })
      const state = reducer(currentState, {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'dateLastEdited' }
      })

      test('should set visible projects to [1, 3, 2, 4, 5]', () => {
        expect(state.visibleProjects).toEqual([1, 3, 2, 4, 5])
      })

      test('should set state.sortBy to dateLastEdited', () => {
        expect(state.sortBy).toEqual('dateLastEdited')
      })

      test('should set state.direction to asc', () => {
        expect(state.direction).toEqual('asc')
      })
    })

    describe('sort by: dateLastEdited descending', () => {
      const currentState = getStateWithProjects({ direction: 'asc', visibleProjects: [4, 3, 2, 5, 1] })
      const state = reducer(currentState, {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'dateLastEdited' }
      })

      test('should set visible projects to [5, 4, 2, 3, 1]', () => {
        expect(state.visibleProjects).toEqual([5, 4, 2, 3, 1])
      })

      test('should set state.sortBy to dateLastEdited', () => {
        expect(state.sortBy).toEqual('dateLastEdited')
      })

      test('should set state.direction to desc', () => {
        expect(state.direction).toEqual('desc')
      })
    })

    describe('sort by: lastEditedBy ascending', () => {
      const currentState = getStateWithProjects({ direction: 'desc', visibleProjects: [4, 3, 2, 5, 1] })
      const state = reducer(currentState, {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'lastEditedBy' }
      })

      test('should set visible projects to [4, 5, 1, 2, 3]', () => {
        expect(state.visibleProjects).toEqual([4, 5, 1, 2, 3])
      })

      test('should set state.sortBy to lastEditedBy', () => {
        expect(state.sortBy).toEqual('lastEditedBy')
      })

      test('should set state.direction to asc', () => {
        expect(state.direction).toEqual('asc')
      })
    })

    describe('sort by: lastEditedBy descending', () => {
      const currentState = getStateWithProjects({ direction: 'asc', visibleProjects: [4, 3, 2, 5, 1] })
      const state = reducer(currentState, {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'lastEditedBy' }
      })

      test('should set visible projects to [3, 2, 1, 5, 4]', () => {
        expect(state.visibleProjects).toEqual([3, 2, 1, 5, 4])
      })

      test('should set state.sortBy to lastEditedBy', () => {
        expect(state.sortBy).toEqual('lastEditedBy')
      })

      test('should set state.direction to desc', () => {
        expect(state.direction).toEqual('desc')
      })
    })
  })

  xdescribe('SORT_BOOKMARKED', () => {
    test('should move bookmarked projects to the top and sort those depending on the sort label selected', () => {
      const currentState = getStateWithProjects({ bookmarkList: [1, 3, 4] })
      const state = reducer(currentState, { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } })
      expect(state.visibleProjects).toEqual([...sortedByDateAndBookmarked])
    })

    test('should set state.sortBookmarked to true', () => {
      const currentState = getStateWithProjects({ bookmarkList: [1, 3, 4] })
      const state = reducer(currentState, { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } })
      expect(state.sortBookmarked).toEqual(true)
    })

    test('should not change the order of the projects if no projects are bookmarked', () => {
      const currentState = getStateWithProjects({ bookmarkList: [], visibleProjects: [...defaultSorted] })
      const state = reducer(currentState, { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } })
      expect(state.visibleProjects).toEqual(defaultSorted)
    })

    test('should move bookmarked projects back to their original order by sort label if sorting by bookmarked is disabled', () => {
      const currentState = getStateWithProjects({
        bookmarkList: [4, 3, 1],
        sortBookmarked: true,
        visibleProjects: [...sortedByDateAndBookmarked]
      })
      const state = reducer(currentState, { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: false } })
      expect(state.visibleProjects).toEqual([...defaultSorted])
    })

    test('should set state.sortBookmarked to false', () => {
      const currentState = getStateWithProjects({
        bookmarkList: [4, 3, 1],
        sortBookmarked: true,
        visibleProjects: [...sortedByDateAndBookmarked]
      })
      const state = reducer(currentState, { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: false } })
      expect(state.sortBookmarked).toEqual(false)
    })
  })

  xdescribe('UPDATE_SEARCH_VALUE', () => {
    describe('found matches', () => {
      const currentState = getStateWithProjects()
      const state = reducer(currentState, { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'Led' } })
      test('should update visible projects if there are matches for the search value', () => {
        expect(state.visibleProjects).toEqual([4])
      })

      test('should update state.matches to an array of matching project ids', () => {
        expect(state.matches).toEqual([4])
      })

      test('should update state.projectCount to number of total matches', () => {
        expect(state.projectCount).toEqual(1)
      })

      test('should update state.searchValue to action.payload.searchValue', () => {
        expect(state.searchValue).toEqual('Led')
      })
    })

    describe('no matches found', () => {
      const currentState = getStateWithProjects()
      const state = reducer(currentState, { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'cxx' } })

      test('should update visibleProjects to be an empty array', () => {
        expect(state.visibleProjects).toEqual([])
      })

      test('should update state.matches to an empty array', () => {
        expect(state.matches).toEqual([])
      })

      test('should update state.projectCount to 0', () => {
        expect(state.projectCount).toEqual(0)
      })

      test('should set state.searchValue to action.payload.searchValue', () => {
        expect(state.searchValue).toEqual('cxx')
      })
    })

    describe('clearing search field', () => {
      const currentState = getStateWithProjects({
        visibleProjects: [4],
        matches: [4],
        searchValue: 'Led',
        projectCount: 1
      })
      const state = reducer(currentState, { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: '' } })

      test('should set the projects back to previous state', () => {
        expect(state.visibleProjects).toEqual(defaultSorted)
      })

      test('should set state.projectCount to total number of projects', () => {
        expect(state.projectCount).toEqual(5)
      })

      test('should set state.searchValue to an empty string', () => {
        expect(state.searchValue).toEqual('')
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state to initial state, expect for rowsPerPage', () => {
      const state = reducer(getState({ rowsPerPage: 5 }), { type: types.FLUSH_STATE })
      expect(state).toEqual(getState({ rowsPerPage: 5, projects: { visible: [], matches: [] } }))
    })
  })
})
