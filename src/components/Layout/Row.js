import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'

const Row = ({ flex, displayFlex, children, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    display: displayFlex ? 'flex' : 'block',
    flexDirection: 'row',
    ...style
  }

  return (
    <Grid item style={styles} {...otherProps}>
      {children}
    </Grid>
  )
}

Row.propTypes = {
  flex: PropTypes.bool,
  displayFlex: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object
}

Row.defaultProps = {
  flex: false,
  displayFlex: false
}

export default Row