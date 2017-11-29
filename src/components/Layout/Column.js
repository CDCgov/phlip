import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'

const Column = ({ flex, displayFlex, children, component, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    display: displayFlex ? 'flex' : 'block',
    flexDirection: 'column',
    ...style
  }

  return (
    React.cloneElement(
      component,
      {
        children,
        style: styles,
        ...otherProps
      }
    )
  )
}

Column.propTypes = {
  flex: PropTypes.bool,
  displayFlex: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  component: PropTypes.element
}

Column.defaultProps = {
  flex: false,
  displayFlex: false,
  component: <Grid item />
}

export default Column