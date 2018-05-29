This is the main file for setting up the redux store, redux-persist, and
redux-logic.

This file exports: api, store, persistor, history

### redux store
The redux store that is passed through to the `<Provider>` component in
`src/App.js` is created in the createStore function call. You pass the
createStore function the root reducer, which comes from `src/reducer.js`
for the project as well as any middleware. We use redux-logic middleware,
more info on redux-logic below.

```javascript static
const store = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(createLogicMiddleware(rootLogic, { api, history }))
  )
)
```

### redux-logic
redux-logic is initialized as middleware for the redux-store with all of
the logic from `src/logic.js` which is all of the app logic combined from
the logic in the scenes components. The logic is passed through when the
store is created in the createStore function.

redux-logic can take dependencies that are pushed down to all of your
redux-logic. For the app, the dependencies are `api` and `history`.

`history` is a standard browser history object that is passed as a
dependecy to the `api` for handling unauthorized requests.