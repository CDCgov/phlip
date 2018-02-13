import React from 'react'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import IconButton from 'components/IconButton'
import TextLink from 'components/TextLink'
import Container, { Column } from 'components/Layout'
import { withRouter } from 'react-router-dom'

export const PageHeader = ({ history }) => {
  return (
    <Container alignItems="center" style={{ height: '80px' }}>
      <Column style={{ paddingRight: 5 }}>
        <IconButton iconSize={30} color="black" onClick={() => history.push('/')}>arrow_back</IconButton>
      </Column>
      <Column flex>
        <Typography type="title">User Management</Typography>
      </Column>
      <Column>
        <TextLink to={{ pathname: '/admin/new/user' }}>
          <Button value="+ Add New User" color="accent" />
        </TextLink>
      </Column>
    </Container>
  )
}

export default withRouter(PageHeader)