import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import rootReducer from '../../reducer'

const INITIAL_STATE = {};

const store = createStore(
  rootReducer,
  INITIAL_STATE
  //applyMiddleware(createLogicMiddleware()) // we should add api dependency to the logic middleware
);

export default store