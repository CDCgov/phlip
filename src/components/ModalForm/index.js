import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import Button from 'components/Button'
import IconButton from 'components/IconButton'
import Form from 'components/Form'
import Container, { Column } from 'components/Layout'

const ModalForm = ({ handleSubmit, form, onClose, open, actions, title, width, height, children, asyncValidate, asyncBlurFields, initialValues, editForm, edit, editButton }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit} form={form} asyncValidate={asyncValidate} asyncBlurFields={asyncBlurFields}
            initialValues={initialValues} style={{ width, height }}>
        <DialogTitle>
          <Container alignItems="center">
            <Column flex>
              {title}
            </Column>
            <Column>
              <Container alignItems="center">
                {!edit && editButton && <IconButton onClick={editForm} color="secondary">mode_edit</IconButton>}
                {!edit && <IconButton onClick={onClose} color="error" iconSize={25}
                                      style={{ fontWeight: 'bold' }}>close</IconButton>}
              </Container>
            </Column>
          </Container>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          {edit && actions.map(action => (
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
  initialValues: PropTypes.object,
  edit: PropTypes.bool,
  editButton: PropTypes.bool
}

ModalForm.defaultProps = {
  editButton: false,
  edit: true
}

export default ModalForm