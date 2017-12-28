import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import SearchBar from 'components/SearchBar'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import Table from 'components/Table'
import { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table'
import * as actions from 'scenes/Home/scenes/AddEditProject/actions'
import IconButton from 'components/IconButton'

export class AddEditJurisdictions extends Component {
  constructor (props, context) {
    super(props, context)
  }

  onCloseModal = () => {
    this.props.history.goBack()
  }

  getButton = () => <Button value="+ Add Jurisdiction" color="accent" />

  getJurisdictionRow = (jurisdiction, i) => {
    return (
      <TableRow key={`jurisdiction-${i}`}>
        <TableCell key={`${i}-segment-name`}>
          {jurisdiction.name}
        </TableCell>
        <TableCell key={`${i}-segment-start`}>
          {new Date(jurisdiction.startDate).toLocaleDateString()}
        </TableCell>
         <TableCell key={`${i}-segment-end`}>
          {new Date(jurisdiction.endDate).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <IconButton color="accent">mode_edit</IconButton>
        </TableCell>
        <TableCell>
          <IconButton color="error">delete</IconButton>
        </TableCell>
      </TableRow>
    )
  }

  render () {
    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md">
        <ModalTitle title="Jurisdictions" buttons={this.getButton()} />
        <ModalContent style={{ minWidth: 550, minHeight: 230 }}>
          <Container>
            <SearchBar />
          </Container>
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }} component={<Card />}>
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
                {this.props.project.jurisdictions.map(this.getJurisdictionRow)}
              </TableBody>
            </Table>
            </Column>
          </Container>
        </ModalContent>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id]
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))
