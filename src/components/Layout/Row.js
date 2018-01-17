import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'

const Row = ({ flex, displayFlex, children, reverse, component, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    display: displayFlex ? 'flex' : 'block',
    flexDirection: reverse ? 'row-reverse' : 'row',
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

Row.propTypes = {
  flex: PropTypes.bool,
  displayFlex: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  component: PropTypes.element
}

Row.defaultProps = {
  flex: false,
  displayFlex: false,
  component: <Grid item />
}

export default Row