import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Form from 'components/Form'

const FormModal = ({ handleSubmit, form, onClose, open, width, height, children, asyncValidate, asyncBlurFields, initialValues, validate }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit}
            form={form}
            asyncValidate={asyncValidate}
            asyncBlurFields={asyncBlurFields}
            validate={validate}
            initialValues={initialValues}
            style={{ width, height }}
      >
        { children }
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
}

FormModal.defaultProps = {
  open: true
}

export default FormModal