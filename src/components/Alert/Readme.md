#### Alert example.
Click the button to see what the alert would look like.

```jsx
initialState = { open: false }

actions = [
  { value: 'Cancel', type: 'button', onClick: () => setState({ open: false }) },
  { value: 'Continue', type: 'button', onClick: () => setState({ open: false }) }
];

<div>
  <Button onClick={() => setState({ open: true })} value="Open alert"></Button>
  <Alert open={state.open} actions={actions}>
    I am an alert. Something happened! Oh no.
  </Alert>
</div>
```