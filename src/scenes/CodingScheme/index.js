import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextLink from 'components/TextLink'
import Button from 'components/Button'
import Container from 'components/Layout'
import * as actions from './actions'

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
              <Button value="Back" />
            </TextLink>
          </Toolbar>
        </AppBar>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)