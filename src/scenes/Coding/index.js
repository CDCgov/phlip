import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import Header from './components/Header'
import Footer from './components/Footer'
import Container, { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {

  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Container flex column style={{ backgroundColor: '#f5f5f5' }}>
          <Row flex displayFlex>
          </Row>
          <Row displayFlex style={{ height: 50, alignItems: 'center', paddingLeft: 10, paddingRight: 10, justifyContent: 'space-between' }}>
            <Row displayFlex>
              <IconButton color="black">arrow_back</IconButton>
              <Typography type="body2"><span style={{ color: '#0faee6', fontSize: 16, paddingLeft: 5 }}>Previous question</span></Typography>
            </Row>
            <Row displayFlex>
              <Typography type="body2"><span style={{ color: '#0faee6', fontSize: 16, paddingRight: 5 }}>Next question</span></Typography>
              <IconButton color="black">arrow_forward</IconButton>
            </Row>
          </Row>
        </Container>
        <Footer />
      </Container>
    )
  }
}

Coding.propTypes = {

}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id
})

export default connect(mapStateToProps)(Coding)