import React from 'react'
import Typography from '@material-ui/core/Typography'
import Container, { Row, Column } from 'components/Layout/index'
import Button from 'components/Button/index'

const ProdLoginForm = ({ pivError }) => (
  <Container column style={{ padding: 30 }}>
    <Row displayFlex style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Typography>
        You must be registered with SAMS and required to sign in with your CDC account below, otherwise
        you will receive a sign in error.
      </Typography>
    </Row>
    <Row displayFlex flex style={{ justifyContent: 'center', paddingTop: 20 }}>
      <Column style={{ padding: 16 }}>
        <Button href={APP_SAML_REQUEST_URL} type="button" color="accent" value="PIV Login" />
      </Column>
    </Row>
    {pivError && <Typography color="error" align="center">{pivError}</Typography>}
  </Container>
)

export default ProdLoginForm