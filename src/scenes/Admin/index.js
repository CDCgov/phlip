import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import UserList from './components/UserList/index'
import PageHeader from './components/PageHeader'
import * as actions from './actions'
import { bindActionCreators } from 'redux';
import AddEditUser from './scenes/AddEditUser'
import { Route } from 'react-router-dom'
import Container from 'components/Layout'

export class Admin extends Component {
  static propTypes = {
    users: PropTypes.array,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    sortBy: PropTypes.string,
    direction: PropTypes.string
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
        <PageHeader />
        <Divider />
        <UserList
          users={this.props.users}
          page={this.props.page}
          rowsPerPage={this.props.rowsPerPage}
          sortBy={this.props.sortBy}
          direction={this.props.direction}
          handleRequestSort={property => event => this.props.actions.sortUsers(property)} />
        <Route
          path="/admin/new/user"
          component={AddEditUser} />
        <Route
          path="/admin/edit/user/:id"
          component={AddEditUser} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.scenes.admin.main.users,
  page: state.scenes.admin.main.page,
  rowsPerPage: state.scenes.admin.main.rowsPerPage,
  sortBy: state.scenes.admin.main.sortBy,
  direction: state.scenes.admin.main.direction
})
const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })


export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Admin))