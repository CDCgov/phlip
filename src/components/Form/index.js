import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

let Form = ({ children, handleSubmit, form }) => {
  return (
    <form onSubmit={handleSubmit} form={form}>
      { children }
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