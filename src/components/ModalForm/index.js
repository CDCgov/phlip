import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import Button from 'components/Button'
import Form from 'components/Form'

const ModalForm = ({ handleSubmit, form, onClose, open, actions, title, width, height, children, asyncValidate, asyncBlurFields, initialValues }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit} form={form} asyncValidate={asyncValidate} asyncBlurFields={asyncBlurFields} initialValues={initialValues} style={{ width, height }}>
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          {actions.map(action => (
            <Button
              key={action.value}
              raised={false} value={action.value}
              type={action.type}
              color="accent"
              disabled={action.disabled || false}
              onClick={action.onClick} />
          ))}
        </DialogActions>
      </Form>
    </Dialog>
  )
}

ModalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.node,
  asyncValidate: PropTypes.any,
  asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
  initialValues: PropTypes.object
}

export default ModalForm