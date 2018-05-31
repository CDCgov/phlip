#### Basic IconButton example
Click the ship wheel
```jsx
const ShipWheel = require('mdi-material-ui').ShipWheel
const Typography = require('material-ui').Typography
initialState = { clicked: 0 };

<div>
  <IconButton color="primary" onClick={() => setState({ clicked: state.clicked + 1 })}>
    <ShipWheel />
  </IconButton>
  <Typography>I've been clicked {state.clicked} times.</Typography>
</div>
```