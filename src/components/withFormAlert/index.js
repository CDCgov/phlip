import React, { Component, Fragment } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Alert from 'components/Alert'
import Typography from 'material-ui/Typography'
import Icon from 'components/Icon'

export const withFormAlert = (WrappedComponent) => {
  class FormAlert extends Component {
    state = {
      open: false,
      text: null,
      actions: []
    }

    constructor(props, context) {
      super(props, context)
    }

    onClose = () => {
      this.setState({
        open: false,
        text: null,
        actions: []
      })
    }

    onContinue = () => {
      this.props.formActions.reset(this.props.formName)
      this.setState({ open: false, text: null, actions: [] })
      this.props.history.goBack()
    }

    onCloseModal = () => {
      const fields = Object.keys(this.props.form.registeredFields)
      let shouldOpenAlert = false
      fields.forEach(field => {
        if (this.props.form.values) {
          if (this.props.form.initial[field] !== this.props.form.values[field]) {
            shouldOpenAlert = true
          }
        }
      })

      if (shouldOpenAlert) {
        this.setState({
          open: true,
          text: 'You have unsaved changes that will be lost if you decide to continue. Are you sure you want to continue?',
          actions: [
            {
              value: 'Cancel',
              type: 'button',
              onClick: this.onClose
            },
            {
              value: 'Continue',
              type: 'button',
              onClick: this.onContinue
            }
          ]
        })
      } else {
        this.props.history.goBack()
      }
    }

    onSubmitError = error => {
      this.props.formActions.setSubmitFailed(this.props.formName)
      this.setState({
        open: true,
        text: error,
        actions: [
          {
            value: 'Dismiss',
            type: 'button',
            onClick: this.onClose
          }
        ],
        title: <Fragment>
          <Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>Uh-oh! Something went wrong.</Fragment>
      })
    }

    render() {
      return (
        <Fragment>
          <WrappedComponent onCloseModal={this.onCloseModal} onSubmitError={this.onSubmitError} {...this.props} />
          <Alert open={this.state.open} title={this.state.title} actions={this.state.actions}>
            <Typography variant="body1">
              {this.state.text}
            </Typography>
          </Alert>
        </Fragment>
      )
    }
  }

  hoistNonReactStatic(FormAlert, WrappedComponent)
  return FormAlert
}

export default withFormAlert