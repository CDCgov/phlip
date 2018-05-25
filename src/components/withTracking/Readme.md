__withTracking__ is simple higher order component (HOC) that will set and / or
update variables required for CDC Adobe Analytics code, so you don't have
to repeat code on multiple components.

When the component calls componentDidMount, withTracking will set different
variables (like pageName) based on a parameter when the HOC component is used.

### Example usage
The 'My Component' string is what you want to show up as the pageName in
Adobe Analytics.
<br/><br/>
``` javascript static
withTracking(MyComponent, 'My Component')
```