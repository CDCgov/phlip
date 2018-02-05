import * as types from './actionTypes'
import { normalize } from 'utils'


const INITIAL_STATE = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {},
  showNextButton: true
}

const validationReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    default:
      return state
  }
}

export default validationReducer