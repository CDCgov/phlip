import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Alert from 'components/Alert'
import Typography from '@material-ui/core/Typography'
import Icon from 'components/Icon'

export const withFormAlert = (WrappedComponent) => {
  class FormAlert extends Component {
    constructor(props, context) {
      super(props, context)

      this.state = {
        open: false,
        text: '',
        actions: [],
        title: null,
        isReduxForm: this.props.isReduxForm !== false
      }
    }

    onClose = () => {
      this.setState({
        open: false,
        text: '',
        actions: [],
        title: null,
        isReduxForm: this.props.isReduxForm !== false
      })
    }

    onDismissFormError = () => {
      this.onClose()
      this.props.actions.resetFormError()
    }

    onContinue = () => {
      if (this.state.isReduxForm) {
        this.props.formActions.reset(this.props.formName)
      } else {
        this.props.actions.resetToInitial()
      }
      this.setState({ open: false, text: '', actions: [], title: null })
      this.props.history.goBack()
    }

    onCloseModal = (otherValues = {}) => {
      const fields = [...Object.keys(this.props.form.registeredFields), ...Object.keys(otherValues)]
      let shouldOpenAlert = false
      fields.forEach(field => {
        if (this.props.form.initial[field] !== this.props.form.values[field]) {
          shouldOpenAlert = true
        } else if (otherValues.hasOwnProperty(field)) {
          if (otherValues[field] !== this.props.form.initial[field]) {
            shouldOpenAlert = true
          }
        }
      })

      if (shouldOpenAlert) {
        this.setState({
          open: true,
          text: 'You will lose unsaved changes. Do you want to continue?',
          actions: [
            {
              value: 'Cancel',
              type: 'button',
              onClick: this.onClose,
              preferred: true
            },
            {
              value: 'Continue',
              type: 'button',
              onClick: this.onContinue
            }
          ],
          title: null
        })
      } else {
        this.props.history.goBack()
      }
    }

    onSubmitError = error => {
      if (this.state.isReduxForm) {
        this.props.formActions.setSubmitFailed(this.props.formName)
      }

      this.setState({
        open: true,
        text: error,
        actions: [
          {
            value: 'Dismiss',
            type: 'button',
            onClick: this.onDismissFormError
          }
        ],
        title: (
          <>
            <Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
            Uh-oh! Something went wrong.
          </>
        )
      })
    }

    render() {
      return (
        <>
          <WrappedComponent onCloseModal={this.onCloseModal} onSubmitError={this.onSubmitError} {...this.props} />
          <Alert open={this.state.open} title={this.state.title} actions={this.state.actions}>
            <Typography variant="body1">
              {this.state.text}
            </Typography>
          </Alert>
        </>
      )
    }
  }

  hoistNonReactStatic(FormAlert, WrappedComponent)
  return FormAlert
}

export default withFormAlert