__withTracking__ is simple higher order component (HOC) that will set and / or
update variables required for CDC AdobeAnalytics code, so you don't have
to repeat code on multiple components.

When the component calls componentDidMount, withTracking will set the
variables based on a parameter when the HOC component is used.

### Example usage
``` javascript static
withTracking(MyComponent, 'My Component')
```