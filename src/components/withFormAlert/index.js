import React, { Component, Fragment } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Alert from 'components/Alert'

export const withFormAlert = (WrappedComponent) => {
  class FormAlert extends Component {
    state = {
      open: false
    }

    constructor(props, context) {
      super(props, context)
    }

    onClose = () => {
      this.setState({
        open: false
      })
    }

    onContinue = () => {
      this.props.formActions.reset(this.props.formName)
      this.setState({ open: false })
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
          open: true
        })
      } else {
        this.props.history.goBack()
      }
    }

    render() {
      const alertActions = [
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

      return (
        <Fragment>
          <WrappedComponent onCloseModal={this.onCloseModal} {...this.props} />
          <Alert
            open={this.state.open}
            text="You have unsaved changes that will be lost if you decide to continue. Are you sure you want to continue?"
            actions={alertActions}
          />
        </Fragment>
      )
    }
  }

  hoistNonReactStatic(FormAlert, WrappedComponent)
  return FormAlert
}

export default withFormAlert