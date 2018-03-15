import React from 'react'
import Typography from 'material-ui/Typography'
import { EmoticonPoop } from 'mdi-material-ui'
import Container from 'components/Layout'

const PageNotFound = () => (
  <Container alignItems="center" style={{ justifyItems: 'center' }}>
    <Typography
      style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      type="display4"
      align="center">No page for you <EmoticonPoop style={{ width: 100, height: 100 }} /></Typography>
  </Container>
)

export default PageNotFound
