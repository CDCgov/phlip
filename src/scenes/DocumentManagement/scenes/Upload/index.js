import React, { Component } from 'react'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Grid from 'components/Grid'
import Typography from '@material-ui/core/Typography/Typography'
import Divider from '@material-ui/core/Divider/Divider'
import Button from 'components/Button'
import FileRow from './components/FileRow'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'

export class Upload extends Component {
  state = {
    selectedDocs: []
  }

  constructor(props, context) {
    super(props, context)

    this.inputDropRef = React.createRef()
    this.selectButtonRef = React.createRef()
  }

  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    this.props.history.push('/docs')
    this.props.actions.clearSelectedFiles()
  }

  initiateFileSelecter = () => {
    this.inputDropRef.current.click()
  }

  addFilesToList = (e) => {
    e.preventDefault()
    let files = []

    Array.from(Array(e.target.files.length).keys()).map(x => {
      const i = e.target.files.item(x)
      files.push({ name: i.name, lastModifiedDate: i.lastModifiedDate, tags: [], file: i })
    })

    this.props.actions.addSelectedDocs(files)
  }

  onUploadFiles = () => {
    let md = [], fd = { files: [] }, md2 = {}
    const formData = new FormData()
    formData.append('userId', this.props.user.id)
    formData.append('userFirstName', this.props.user.firstName)
    formData.append('userLastName', this.props.user.lastName)

    this.props.selectedDocs.map((doc, i) => {
      console.log(doc)
      const { file, ...otherProps } = doc
      formData.append('files', file, doc.name)
      md2[doc.name] = otherProps
      fd.files = [...fd.files, file]
    })

    formData.append('metadata', JSON.stringify(md2))
    this.props.actions.uploadDocumentsRequest(formData)
  }

  render() {
    const closeButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      onClick: this.onCloseModal
    }

    const modalActions = this.props.selectedDocs.length > 0
      ? [
        closeButton,
        { value: 'Upload', type: 'button', otherProps: { 'aria-label': 'Upload' }, onClick: this.onUploadFiles }
      ]
      : [closeButton]

    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="lg" hideOverflow>
        <ModalTitle
          title={
            <Typography variant="title">
              <span style={{ paddingRight: 10 }}>Upload Documents</span>
            </Typography>
          }
        />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <form encType="multipart/form-data" style={{ margin: '20px 0' }}>
            <Grid
              container
              type="row"
              align="center"
              justify="flex-start"
              style={{
                border: '3px dashed #99D0E9',
                borderRadius: 4,
                height: 64,
                backgroundColor: '#f5fafa',
                paddingLeft: 10
              }}>
              <Button
                raised
                color="white"
                textColor="black"
                onClick={this.initiateFileSelecter}
                ref={this.selectButtonRef}
                value="Select files"
              />
              <Grid flex container type="row" style={{ position: 'relative', height: '100%' }}>
                <input
                  ref={this.inputDropRef}
                  multiple
                  type="file"
                  onChange={this.addFilesToList}
                  style={{ opacity: 0, height: '100%', width: '100%', position: 'absolute' }}
                />
                <Typography
                  variant="body2"
                  style={{ color: '#646465', marginLeft: 10, alignSelf: 'center' }}>
                  or drag and drop files here
                </Typography>
              </Grid>
            </Grid>
          </form>
          <Grid flex style={{ overflow: 'auto' }}>
            {this.props.selectedDocs.map((doc, i) => {
              return <FileRow
                key={`selectedDoc-${i}`}
                index={i}
                name={doc.name}
                tags={doc.tags}
                onAddTag={this.props.actions.addTag}
                onRemoveTag={this.props.actions.removeTag}
                onChangeProperty={this.props.actions.updateDocumentProperty}
                onRemoveDoc={this.props.actions.removeDoc}
              />
            })}
          </Grid>
        </ModalContent>
        <ModalActions actions={modalActions} />
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  selectedDocs: state.scenes.docManage.upload.selectedDocs,
  uploadError: state.scenes.docManage.upload.uploadError,
  uploadedDocs: state.scenes.docManage.upload.uploadedDocs,
  uploading: state.scenes.docManage.upload.uploading,
  user: state.data.user.currentUser
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Upload)