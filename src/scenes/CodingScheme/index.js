import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import { Link } from 'react-router-dom'
import * as actions from './actions'
import AppBar from 'components/AppBar'
import Button from 'components/Button'
import Container, { Row, Column } from 'components/Layout'

export class CodingScheme extends Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <Container column flex>
        <AppBar>
          <Typography type="title" color="inherit" style={{ flex: 1 }}>
            Coding Scheme | <span style={{ color: '#0faee6' }}>{this.props.projectName}</span>
          </Typography>
          <Button value="+ Add New Question" color="accent" />
        </AppBar>
        <Container flex style={{ backgroundColor: '#f5f5f5' }}>
          
        </Container>
          <Row component={<Paper />} displayFlex reverse elevation={0} square={true}
               style={{ height: 64, alignItems: 'center', padding: '0 24px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}><Button value="Close" closeButton>Close</Button></Link>
          </Row>
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