import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { sortList, updater, tableUtils, searchUtils } from 'utils'

const INITIAL_STATE = {
  projects: [],
  matches: [],
  bookmarkList: [],
  visibleProjects: [],
  normalizedVisible: [],
  normalizedMatches: [],
  normalizedProjects: {},
  allIds: [],
  searchValue: '',
  rowsPerPage: 10,
  page: 0,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false,
  projectCount: 0
}

const normalizeArrayToObject = (arr, key) => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  const bookmarked = sortList(projects.filter(project => bookmarkList.includes(project.id)), sortBy, direction)
  const nonBookmarked = sortList(projects.filter(project => !bookmarkList.includes(project.id)), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

const anyBookmarks = (projects, bookmarkList) => projects.filter(project => bookmarkList.includes(project.id)).length >
  0

const isMatch = (value, search) => value.toLowerCase().includes(search)

const searchForMatches = (projects, searchValue) => {
  return projects.filter(project => {
    return isMatch(project.name, searchValue)
      || isMatch(project.lastEditedBy, searchValue)
      || isMatch(new Date(project.dateLastEdited).toLocaleDateString(), searchValue)
  })
}

const mapProjects = arr => {
  return arr.map(p => p.id)
}

const getArrays = (arr, arrName, state) => {
  const { bookmarkList, sortBy, direction, sortBookmarked } = state

  return sortBookmarked
    ? anyBookmarks(arr, bookmarkList)
      ? sortProjectsByBookmarked(arr, bookmarkList, sortBy, direction)
      : sortList(arr, sortBy, direction)
    : sortList(arr, sortBy, direction)

}

const getPArrays = state => {
  const { projects, searchValue, page, rowsPerPage } = state
  let matches = []
  const updatedProjects = getArrays(Object.values(state.projects), 'projects', state)

  if (projects.length === 0) return state

  if (searchValue !== undefined && searchValue.length > 0) {
    matches = searchUtils.searchForMatches(Object.values(state.projects), searchValue, [
      'name', 'dateLastEdited', 'lastEditedBy'
    ])

    if (matches.length === 0) {
      return { ...state, matches: [], visibleProjects: [], allIds: [], projectCount: 0 }
    } else {
      let updatedMatches = getArrays(matches, 'matches', state)
      return {
        ...state,
        matches: [...mapProjects(updatedMatches)],
        allIds: mapProjects(updatedProjects),
        visibleProjects: mapProjects(tableUtils.sliceTable(updatedMatches, page, rowsPerPage))
      }
    }
  } else {
    return {
      ...state,
      projects: normalizeArrayToObject(updatedProjects, 'id'),
      allIds: mapProjects(updatedProjects),
      visibleProjects: mapProjects(tableUtils.sliceTable(Object.values(updatedProjects), page, rowsPerPage))
    }
  }
}

const mainReducer = (state, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)

  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'searchValue']),
        projects: normalizeArrayToObject(action.payload.projects, 'id')
      }

    case types.TOGGLE_BOOKMARK:
      return updateHomeState(['bookmarkList'])

    case types.SORT_BOOKMARKED:
      return updateHomeState(['sortBookmarked'])

    case types.UPDATE_ROWS:
      return updateHomeState(['rowsPerPage'])

    case types.UPDATE_PAGE:
      return updateHomeState(['page'])

    case types.UPDATE_SEARCH_VALUE:
      console.log(searchUtils.searchForMatches(state.projects, action.payload.searchValue, [
        'name', 'dateLastEdited', 'lastEditedBy'
      ]))
      return {
        ...updateHomeState(['searchValue']),
        matches: searchForMatches([...state.projects], action.payload.searchValue.trim().toLowerCase()),
        normalizedMatches: searchUtils.searchForMatches(
          Object.values(state.normalizedProjects), action.payload.searchValue, [
            'name', 'dateLastEdited', 'lastEditedBy'
          ]
        )
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updater.updateByProperty(action.payload, [...state.projects], 'id'),
        visibleProjects: updater.updateByProperty(action.payload, [...state.visibleProjects], 'id')
      }

    case types.ADD_PROJECT_SUCCESS:
      return {
        ...INITIAL_STATE,
        bookmarkList: state.bookmarkList,
        projects: [action.payload, ...state.projects]
      }

    case types.SORT_PROJECTS:
      return {
        ...updateHomeState(['sortBy']),
        direction: state.direction === 'asc' ? 'desc' : 'asc'
      }

    case types.GET_PROJECTS_FAIL:
      return {
        ...state, errorContent: 'We failed to get the list of projects. Please try again later.', error: true
      }

    case types.FLUSH_STATE:
      return { ...INITIAL_STATE, rowsPerPage: state.rowsPerPage }

    case types.UPDATE_PROJECT_FAIL:
    case types.GET_PROJECTS_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    default:
      return state
  }
}

const homeReducer = (state = INITIAL_STATE, action) => {
  return Object.values(types).includes(action.type)
    ? { ...state, ...getPArrays({ ...mainReducer(state, action) }) }
    : state
}

const homeRootReducer = combineReducers({
  main: homeReducer,
  newProject: newProjectReducer
})

export default homeRootReducer
