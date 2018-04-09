import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Icon from 'components/Icon'
import { Row } from 'components/Layout'

export const ApiErrorView = ({ error }) => {
  return (
    <div style={{ position: 'relative', top: '20%' }}>
      <Row displayFlex style={{ justifyContent: 'center' }}>
        <Icon size={175} color="#757575">
          sentiment_very_dissatisfied
        </Icon>
      </Row>
      <Row displayFlex style={{ justifyContent: 'center' }}>
        <Typography type="display2" style={{ textAlign: 'center' }}>
          Uh-oh! Something went wrong. {error} Please try again later.
        </Typography>
      </Row>
    </div>
  )
}

ApiErrorView.propTypes = {
  error: PropTypes.string
}

export default ApiErrorView