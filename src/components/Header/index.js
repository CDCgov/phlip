import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import Greeting from './components/Greeting'
import Avatar from 'components/Avatar'
import Admin from '../../scenes/Admin'
import { Link } from 'react-router-dom'


const Header = ({ theme, user }) => {
  const bgColor = theme.palette.primary['600']

  const styles = {
    height: '100px',
    backgroundColor: bgColor,
    padding: '0 30px'
  }

  return (
    <Grid container spacing={0} alignItems="center" style={styles}>
      <Grid item xs>
        <Link style={{ textDecoration: 'none' }} to="/"><Logo fontSize="30px" /></Link>
      </Grid>
      <Grid item>
        <Grid container spacing={8} alignItems="center">
          <Grid item>
            <Greeting firstName={user.firstName} lastName={user.lastName} role={user.role} />
          </Grid>
          <Grid item>
            <Link style={{ textDecoration: 'none' }} to="/admin"><Avatar big initials={user.firstName ? `${user.firstName[0]}${user.lastName[0]}` : ''} /></Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  theme: PropTypes.object.isRequired,
  user: PropTypes.object
}

export default withTheme()(Header)