ApiErrorAlert example. Click the button to see what the alert would look like.

```jsx
initialState = { open: false };

<div>
  <Button onClick={() => setState({ open: true })} value="Open alert"></Button>
  <ApiErrorAlert
    open={state.open}
    onCloseAlert={() => setState({ open: false })}
    content="Failed to do something"
  />
</div>
```