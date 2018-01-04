import React from 'react'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import CircleIcon from 'components/CircleIcon'
import TextLink from 'components/TextLink'
import Container, { Column } from 'components/Layout'

export const PageHeader = () => {
  return (
    <Container alignItems="center" style={{ height: '75px' }}>
      <Column flex>
        <Container spacing={8} alignItems="center">
          <Column>
            <CircleIcon circleColor="error" iconColor="white" circleSize="30px" iconSize="19px">face</CircleIcon>
          </Column>
          <Column>
            <Typography type="title">User Management</Typography>
          </Column>
        </Container>
      </Column>
      <Column>
        <TextLink to="/admin/new/user" style={{ color: 'white' }}>
          <Button value=" + Add new user" color="accent" />
        </TextLink>
      </Column>
    </Container>
  )
}



export default PageHeader