import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import Container, { Row, Column } from 'components/Layout'
import LoginForm from './components/LoginForm'
import { Field, SubmissionError } from 'redux-form'
import FormTextInput from 'components/FormTextInput'
import * as actions from './actions'
import { withRouter } from 'react-router-dom'

export class Login extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidUpdate() {
    if (this.props.session) {
      this.props.history.push('/')
    }
  }

  handleSubmit = (values) => {
    this.props.actions.loginUserRequest(values)
  }

  render() {
    return (
      <Container column flex alignItems="center" justify="center" style={{ backgroundColor: '#f5f5f5' }}>
        <LoginForm onSubmit={this.handleSubmit}>
          <Grid container direction="column" alignItems="center" spacing={16}>
            <Grid item>
              <Field
                name="email"
                label="Email"
                component={FormTextInput}
                width={250} />
            </Grid>
            <Grid item>
              <Field
                name="password"
                label="Password"
                type="password"
                component={FormTextInput}
                width={250} />
            </Grid>
          </Grid>
        </LoginForm>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user.currentUser || undefined,
  session: state.scenes.login.session || false
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))