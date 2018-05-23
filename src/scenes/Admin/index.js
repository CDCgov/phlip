import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import UserList from './components/UserList/index'
import PageHeader from 'components/PageHeader'
import * as actions from './actions'
import { bindActionCreators } from 'redux'
import AddEditUser from './scenes/AddEditUser'
import { Route } from 'react-router-dom'
import Container from 'components/Layout'
import withTracking from 'components/withTracking'

/**
 * Represents the parent User Management component, that displays a list of users in the system
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

  componentWillMount() {
    this.props.actions.getUsersRequest()
  }

  render() {
    return (
      <Container column flex>
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
          }} />
        <Divider />
        <UserList
          users={this.props.users}
          sortBy={this.props.sortBy}
          direction={this.props.direction}
          handleRequestSort={property => event => this.props.actions.sortUsers(property)}
        />
        <Route path="/admin/new/user" component={AddEditUser} />
        <Route path="/admin/edit/user/:id" component={AddEditUser} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.scenes.admin.main.users,
  sortBy: state.scenes.admin.main.sortBy,
  direction: state.scenes.admin.main.direction
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(withTracking(Admin, 'User Management')))