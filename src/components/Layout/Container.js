import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'

const Container = ({ column, flex, spacing, children, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    ...style
  }

  return (
    <Grid container direction={column ? 'column' : 'row'} spacing={spacing} style={styles} {...otherProps}>
      {children}
    </Grid>
  )
}

Container.propTypes = {
  column: PropTypes.bool,
  flex: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.object
}

Container.defaultProps = {
  spacing: 0,
  flex: false,
  column: false
}

export default Container