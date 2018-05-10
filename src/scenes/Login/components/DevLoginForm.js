import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button/index'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import Divider from 'material-ui/Divider'
import TextInput from 'components/TextInput/index'
import Container, { Column, Row } from 'components/Layout/index'

let DevLoginForm = ({ theme, handleSubmit, pristine, reset, error, submitting, pivError, children }) => (
  <Fragment>
    <form onSubmit={handleSubmit}>
      <Column displayFlex style={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <Row style={{ width: 280, padding: 16 }}>
          <Field name="email" label="Email" component={TextInput} />
        </Row>
      </Column>
      <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
        {error && <Typography color="error" align="center">{error}</Typography>}
        {pivError && <Typography color="error" align="center">{pivError}</Typography>}
      </Row>
      <Row displayFlex flex style={{ justifyContent: 'center', padding: 16 }}>
        <Button type="submit" color="accent" value="Login" disabled={pristine || submitting} />
      </Row>
      <Divider />
    </form>
    <Container column style={{ padding: 30 }}>
      <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Typography>
          You must be registered with SAMS and required to sign in with your CDC account below, otherwise
          you will receive a sign in error.
        </Typography>
      </Row>
      <Row displayFlex flex style={{ justifyContent: 'center', paddingTop: 20 }}>
        <Column style={{ padding: 16 }}>
          <Button href={process.env.APP_SAML_REQUEST_URL} type="button" color="accent" value="PIV Login" />
        </Column>
      </Row>
      {pivError && <Typography color="error" align="center">{pivError}</Typography>}
    </Container>
  </Fragment>
)

DevLoginForm = reduxForm({
  form: 'login',
  validate
})(DevLoginForm)

export default DevLoginForm