import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

/**
 * Basic form wrapper to be used with redux-form
 * @component
 */
export let Form = ({ children, handleSubmit, form, role, ariaLabelledBy }) => {
  return (
    <form onSubmit={handleSubmit} role={role} aria-labelledby={ariaLabelledBy}>
      {children}
    </form>
  )
}

Form.propTypes = {
  /**
   * Function to call when the user submits the form
   */
  handleSubmit: PropTypes.func,

  /**
   * Contents of the form
   */
  children: PropTypes.any,

  /**
   * Form from redux-form
   */
  form: PropTypes.any,

  /**
   * form role
   */
  role: PropTypes.any,

  /**
   * aria-labelled-by
   */
  ariaLabelledBy: PropTypes.any
}

Form = reduxForm({
  destroyOnUnmount: true
})(Form)

export default Form