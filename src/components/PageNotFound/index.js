import React from 'react'
import Typography from 'material-ui/Typography'
import { EmoticonPoop, Ghost, Ninja } from 'mdi-material-ui'
import Container from 'components/Layout'
import styles from './no-page.scss'

const PageNotFound = () => (
  <Container column style={{ justifyContent: 'center', padding: 0 }}>
    <div className={styles.ghost}>
      <Ghost style={{ width: 200, height: 200 }} />
    </div>
    <Typography type="display3" align="center">
      Please contact your administrator to view this page.
    </Typography>
  </Container>
)

export default PageNotFound
