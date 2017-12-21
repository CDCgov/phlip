import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//import * as actions from './actions'
import { withRouter } from 'react-router'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import SearchBar from 'components/SearchBar'
import Button from 'components/Button'
import Container from 'components/Layout'
import Table from 'components/Table'
import { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table'
import * as actions from 'src/scenes/Home/scenes/AddEditProject/actions'

export class AddEditJurisdictions extends Component {
  constructor(props, context) {
    super(props, context)
  }

  onCloseModal = () => {
    this.props.history.goBack()
  }

  getButton = () => <Button value="+ Add Jurisdiction" color="accent" />

  getJurisdictionRow = () => {

  }

  render() {
    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md">
        <ModalTitle title="Jurisdictions" buttons={this.getButton()} />
        <ModalContent style={{ minWidth: 550, minHeight: 230 }}>
          <SearchBar />
          <Container>
            <Table>
              <TableHead>
                <TableRow key="jurisdiction-header">
                  <TableCell key="segment-name">Segments</TableCell>
                  <TableCell key="segment-start">Segment Start Date</TableCell>
                  <TableCell key="segment-end">Segment End Date</TableCell>
                  <TableCell key="segment-edit">Edit</TableCell>
                  <TableCell key="segment-delete">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
          </Container>
        </ModalContent>
      </Modal>
    )
  }
}

const mapStateToProps = (state, otherProps) => ({
  project: state.scenes.home.projects
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))
