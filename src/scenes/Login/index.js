import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import LoginForm from './components/LoginForm'
import { Field } from 'redux-form'
import TextInput from 'components/TextInput'
import * as actions from './actions'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { decodeToken } from 'services/authToken'
import * as userActions from 'data/user/actions'

export class Login extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidUpdate() {
    if (this.props.session) {
      this.props.history.push('/home')
    }
  }

  componentDidMount() {
    console.log(this.props.location.state)
    const match = matchPath(this.props.location.pathname, { path: '/login/verify-user' })
    if (match) {
      const rawToken = this.props.location.search
      const parsedToken = rawToken.substring(rawToken.indexOf('=') + 1)
      const tokenObject = { decodedToken: decodeToken(parsedToken), token: parsedToken }
      this.props.actions.checkPivUserRequest(tokenObject)
    }

    if (this.props.location.state !== undefined) {
      if (this.props.location.state.sessionExpired === true) {
        this.props.actions.logoutUser(true)
      }
    }
  }

  handleSubmit = values => {
    this.props.actions.loginUserRequest(values)
  }

  render() {
    return (
      <Container column flex alignItems="center" justify="center" style={{ backgroundColor: '#f5f5f5' }}>
        <LoginForm onSubmit={this.handleSubmit} pivError={this.props.formMessage}>
          <Column displayFlex style={{ justifyContent: 'space-around', alignItems: 'center' }}>
            <Row style={{ width: 280, padding: 16 }}>
              <Field name="email" label="Email" component={TextInput} />
            </Row>
            <Row style={{ width: 280, padding: 16 }}>
              <Field name="password" label="Password" type="password" component={TextInput} />
            </Row>
          </Column>
        </LoginForm>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  return {
    user: state.data.user.currentUser || undefined,
    session: state.scenes.login.session || false,
    formMessage: state.scenes.login.formMessage || null
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators({ ...actions, ...userActions }, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))