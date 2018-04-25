import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import Typography from 'material-ui/Typography'

export const ApiErrorAlert = ({ content, onCloseAlert, open, actions }) => {
  const title = (
    <Fragment><Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
      Uh-oh! Something went wrong.</Fragment>
  )

  return (
    <Alert
      actions={[{ value: 'Dismiss', type: 'button', onClick: onCloseAlert }, ...actions]}
      open={open}
      title={title}>
      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
        {content} Please try again later.
      </Typography>
    </Alert>
  )
}

ApiErrorAlert.defaultProps = {
  actions: [],
  open: false
}

ApiErrorAlert.propTypes = {
  onCloseAlert: PropTypes.func,
  content: PropTypes.any,
  open: PropTypes.bool,
  actions: PropTypes.array
}

export default ApiErrorAlert