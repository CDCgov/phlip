import React from 'react'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import CircleIcon from 'components/CircleIcon'
import TextLink from 'components/TextLink'

const PageHeader = () => {
  return (
    <Grid container spacing={0} alignItems="center" style={{ height: '100px' }}>
      <Grid item xs>
        <Grid container spacing={8} alignItems="center">
          <Grid item>
            <CircleIcon circleColor="error" iconColor="white" circleSize="35px" iconSize="24px">face</CircleIcon>
          </Grid>
          <Grid item>
            <Typography type="headline">User Management</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <TextLink to="/admin/new/user" style={{ color: 'white' }}>
          <Button value=" + Add new user" color="accent" />
        </TextLink>
      </Grid>
    </Grid>
  )
}



export default PageHeader