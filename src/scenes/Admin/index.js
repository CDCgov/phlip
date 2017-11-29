import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import UserList from './components/UserList/index'
import PageHeader from './components/PageHeader'
import * as actions from './actions'
import { bindActionCreators } from 'redux';
import AddEditUser from './scenes/AddEditUser'
import { Route } from 'react-router-dom'

export class Admin extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getUsersRequest()
  }

  render() {
    return (
      <Grid container spacing={0} direction="column">
        <PageHeader />
        <Divider />
        <UserList users={this.props.users} />
        <Route
          path="/admin/new/user"
          component={AddEditUser} />
        <Route
          path="/admin/edit/user/:id"
          component={AddEditUser} />
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({ users: state.scenes.admin.main.users || [] })
const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })


export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Admin))