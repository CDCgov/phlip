import React, { Component } from 'react'
import Container from 'components/Layout'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Button from 'components/Button'


export class CodingScheme extends Component {

  render() {
    return (
      <Container column flex>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type="title" color="inherit">
              Coding Scheme
          </Typography>
            <TextLink to='/'>
              <Button value="Back"></Button>
            </TextLink>
          </Toolbar>
        </AppBar>

      </Container>
    )
  }
}

export default CodingScheme