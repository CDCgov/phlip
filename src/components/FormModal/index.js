import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Form from 'components/Form'

const FormModal = props => {
  const {
    handleSubmit, form, onClose, open, width, height,
    children, asyncValidate, asyncBlurFields,
    initialValues, validate, maxWidth
  } = props

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth}>
      <Form
        ariaLabelledBy="modal-title"
        onSubmit={handleSubmit}
        form={form}
        asyncValidate={asyncValidate}
        asyncBlurFields={asyncBlurFields}
        validate={validate}
        initialValues={initialValues}
        style={{ width, height }}
      >
        {children}
      </Form>
    </Dialog>
  )
}

FormModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.node,
  asyncValidate: PropTypes.any,
  asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
  initialValues: PropTypes.object,
  maxWidth: PropTypes.string
}

FormModal.defaultProps = {
  open: true
}

export default FormModal