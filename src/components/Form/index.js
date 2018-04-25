import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

let Form = ({ children, handleSubmit, form, role, ariaLabelledBy }) => {
  return (
    <form onSubmit={handleSubmit} role={role} aria-labelledby={ariaLabelledBy}>
      {children}
    </form>
  )
}

Form.propTypes = {
  handleSubmit: PropTypes.func,
  children: PropTypes.any
}

Form = reduxForm({
  destroyOnUnmount: true
})(Form)

export default Form