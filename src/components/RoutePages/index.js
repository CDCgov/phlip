import React from 'react'
import Typography from 'material-ui/Typography'
import { Ghost } from 'mdi-material-ui'
import Container from 'components/Layout'
import styles from './no-page.scss'

export const UnauthPage = () => (
  <Container column style={{ justifyContent: 'center', padding: 0 }}>
    <div className={styles.ghost}>
      <Ghost style={{ width: 200, height: 200 }} />
    </div>
    <Typography type="display3" align="center">
      Please contact your administrator to view this page.
    </Typography>
  </Container>
)

export const PageNotFound = () => (
  <Container column style={{ justifyContent: 'center', padding: 0 }}>
    <div className={styles.ghost}>
      <Ghost style={{ width: 200, height: 200 }} />
    </div>
    <Typography type="display3" align="center">
      Uh-oh! We can't find the page you're looking for.
    </Typography>
  </Container>
)