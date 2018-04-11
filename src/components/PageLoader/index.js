import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Container from 'components/Layout'
import CircularLoader from 'components/CircularLoader'

export const PageLoader = ({ circularLoaderType, circularLoaderProps, message }) => {
  return (
    <Container flex alignItems="center" style={{ justifyContent: 'center' }}>
      {message && <Typography type="display2">{message}</Typography>}
      <CircularLoader type={circularLoaderType} {...circularLoaderProps} />
    </Container>
  )
}

PageLoader.defaultProps = {
  circularLoaderType: 'indeterminate',
  circularLoaderProps: {
    color: 'primary',
    size: 50
  }
}

PageLoader.propTypes = {
  circularLoaderType: PropTypes.string,
  circularLoaderProps: PropTypes.object,
  message: PropTypes.string
}

export default PageLoader