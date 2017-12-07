import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import LoginForm from './components/LoginForm'
import { Field, SubmissionError } from 'redux-form'
import FormTextInput from 'components/FormTextInput'
import * as actions from './actions'
import { withRouter } from 'react-router-dom'

const styles = {
}

const mockUsers = ['test@cdc.gov', 'mta@cdc.gov', 'kmm@cdc.gov', 'tsavel@cdc.gov', 'mpeck@cdc.gov']

export class Login extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidUpdate() {
    if (this.props.user && this.props.session) {
      setTimeout(this.props.history.push('/'), 3000)
    }
  }
  handleSubmit = (values) => {
    if (!mockUsers.includes(values.email)) {
      throw new SubmissionError({
        email: 'User does not exist',
        error: 'Login failed!'
      })
    } else if (values.password !== 'test') {
      throw new SubmissionError({
        password: 'Wrong password',
        error: 'Login failed!'
      })
    } else {
      this.props.actions.loginUserRequest(values)
    }
  }

  render() {
    return (
      <Grid container spacing={0} direction="row" alignItems="center" justify="center" style={{ backgroundColor: '#f5f5f5' }}>
        <Grid item style={styles}>
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
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user.currentUser || undefined,
  session: state.scenes.login.session || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))