import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Container, { Row, Column } from 'components/Layout'

const navStyles = theme => ({
  codeNav: {
    position: 'relative',
    width: 320,
    backgroundColor: '#4c5456',
    borderRight: 0
  }
})

export const Navigator = ({ open, classes }) => {
  return (
    <Drawer classes={{ paper: classes.codeNav }} type="persistent" anchor="left" open={open}>
      <Container column>
        <Row displayFlex style={{ backgroundColor: '#363f41', height: 60, alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
          <Typography type="headline"><span style={{ color: 'white' }}>Coding Navigation</span></Typography>
        </Row>
      </Container>
    </Drawer>
  )
}


Navigator.propTypes = {
  open: PropTypes.bool
}

export default withStyles(navStyles)(Navigator)