import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row } from 'components/Layout'
import * as actions from './actions'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { decodeToken } from 'services/authToken'
import * as userActions from 'data/user/actions'
import Typography from 'material-ui/Typography'
import withTracking from 'components/withTracking'
import Paper from 'material-ui/Paper'
import { withTheme } from 'material-ui/styles'
import Logo from 'components/Logo'
import DevLoginForm from './components/DevLoginForm'
import ProdLoginForm from './components/ProdLoginForm'

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
    const headerStyles = {
      backgroundColor: this.props.theme.palette.primary.main,
      height: 145
    }

    const formStyles = {
      width: 350,
      display: 'flex',
      flexDirection: 'column'
    }
    const LoginView = process.env.API_HOST ? ProdLoginForm : DevLoginForm

    return (
      <Container column flex alignItems="center" justify="center" style={{ backgroundColor: '#f5f5f5' }}>
        <Paper style={formStyles}>
          <Container column alignItems="center" justify="center" style={headerStyles}>
            <Logo height="auto" width={261} />
          </Container>
          {LoginView && <LoginView onSubmit={this.handleSubmit} pivError={this.props.formMessage} />}
        </Paper>
        <Row style={{ textAlign: 'center', width: 600, paddingTop: 30, paddingBottom: 10 }}>
          <Typography type="caption" style={{ color: 'black' }}>You are accessing an information system that may contain U.S. Government data. System usage may
            be monitored, recorded, and subject to audit. Unauthorized use of the system is prohibited and may be
            subject to criminal and civil penalties. Use of the system indicates consent to monitoring and recording.
            Administrative personnel remotely accessing the Azure environment: <br/><br/>
          </Typography>
          <Typography type="caption" style={{ color: 'black' }}>
            (1) shall maintain their remote computer in a secure manner, in accordance with organizational security
            policies and procedures as defined in Microsoft Remote Connectivity Security Policies; <br/>
            (2) shall only access the Azure environment in execution of operational, deployment, and support
            responsibilities using only administrative applications or tools directly related to performing these
            responsibilities; and <br/>
            (3) shall not knowingly store, transfer into, or process in the Azure environment data exceeding a FIPS 199
            Low security categorization</Typography><br/>
          <img src="/cdc-hhs-logo.png" style={{ height: 55 }} alt="Center for Disease Control and Health and Human Services Logo" />
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.data.user.currentUser || undefined,
    session: state.scenes.login.session || false,
    formMessage: state.scenes.login.formMessage || null
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators({ ...actions, ...userActions }, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(withTracking(Login, 'Login'))))