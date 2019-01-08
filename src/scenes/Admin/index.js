import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import UserList from './components/UserList/index'
import PageHeader from 'components/PageHeader'
import actions from './actions'
import { bindActionCreators } from 'redux'
import AddEditUser from './scenes/AddEditUser'
import { Route } from 'react-router-dom'
import Container from 'components/Layout'
import withTracking from 'components/withTracking'

/**
 * Represents the parent User Management component, that displays a list of users in the system. This component is
 * mounted and rendered when the user navigates to the 'User Management' option in the avatar menu. This component has
 * one scene: AddEditUser under ./scenes/AddEditUser
 */
export class Admin extends Component {
  static propTypes = {
    /**
     * List of users to displayed, supplied from redux
     */
    users: PropTypes.array,
    /**
     * Which property of users by which to sort the list
     */
    sortBy: PropTypes.string,
    /**
     * Direction by which to sort list of users
     */
    direction: PropTypes.string,
    /**
     * Redux actions for this component
     */
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  UNSAFE_componentWillMount() {
    this.props.actions.getUsersRequest()
  }

  render() {
    return (
      <Container column flex style={{ padding: '12px 20px 20px 20px' }}>
        <PageHeader
          pageTitle="User Management"
          protocolButton={false}
          projectName=""
          otherButton={{
            isLink: true,
            text: '+ Add New User',
            path: '/admin/new/user',
            state: {},
            props: { 'aria-label': 'Add new user' },
            show: true
          }}
        />
        <Divider />
        <UserList
          users={this.props.users}
          sortBy={this.props.sortBy}
          direction={this.props.direction}
          handleRequestSort={property => () => this.props.actions.sortUsers(property)}
        />
        <Route path="/admin/new/user" component={AddEditUser} />
        <Route path="/admin/edit/user/:id" component={AddEditUser} />
      </Container>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state) => ({
  users: state.scenes.admin.main.users,
  sortBy: state.scenes.admin.main.sortBy,
  direction: state.scenes.admin.main.direction
})

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(withTracking(Admin, 'User Management')))