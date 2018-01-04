import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import Typography from 'material-ui/Typography'
import * as actions from './actions'
import AppBar from 'components/AppBar'
import Button from 'components/Button'

export class CodingScheme extends Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <Container column flex>
        <AppBar>
          <Typography type="title" color="inherit" style={{ flex: 1 }}>
            Coding Scheme | <span style={{color: '#0faee6'}}>{this.props.projectName}</span>
          </Typography>
          <Button value="+ Add New Question" color="accent" />
        </AppBar>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)