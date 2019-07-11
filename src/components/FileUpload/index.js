import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { Alert, FlexGrid, Button } from 'components'

class FileUpload extends Component {
  static propTypes = {
    /**
     * Color of the dashed border for the container
     */
    containerBorderColor: PropTypes.string,
    /**
     * Color of the background of the container
     */
    containerBgColor: PropTypes.string,
    /**
     * Any additional style to be applied to the container
     */
    containerStyle: PropTypes.object,
    /**
     * 'Select files...' button content or text
     */
    buttonText: PropTypes.any,
    /**
     * Whether or not to allow multiple
     */
    allowMultiple: PropTypes.bool,
    /**
     * Container text
     */
    containerText: PropTypes.any,
    /**
     * Allowed file types
     */
    allowedFileTypes: PropTypes.string,
    /**
     * Callback for when files are added
     */
    handleAddFiles: PropTypes.func.isRequired,
    /**
     *  Flag for excel file previously selected
     */
    infoSheetSelected: PropTypes.bool,
    /**
     * Total # of files selected to know when to clear files input
     */
    numOfFiles: PropTypes.number
  }
  
  static defaultProps = {
    containerBorderColor: '#99D0E9',
    containerBgColor: '#f5fafa',
    containerText: 'or drag and drop here',
    buttonText: 'Select Files',
    allowMultiple: false,
    numOfFiles: 0
  }
  
  constructor(props, context) {
    super(props, context)
    this.inputRef = React.createRef()
    this.state = {
      alertOpen: false
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.numOfFiles !== 0 && this.props.numOfFiles === 0) {
      this.inputRef.current.value = null
    }
  }
  
  handleInitiateFileSelector = () => {
    if (this.props.infoSheetSelected) {
      this.setState({
        alertOpen: true
      })
    } else {
      this.inputRef.current.click()
    }
  }
  
  /**
   * Handles when the user cancels out of selecting a new excel file
   */
  onCancelSelectExcel = () => {
    this.setState({
      alertOpen: false
    })
  }
  
  onContinueSelectExcel = () => {
    this.onCancelSelectExcel()
    this.inputRef.current.click()
  }
  
  // Drop handler function to get all files
  getAllFileEntries = async dataTransferItemList => {
    const { allowMultiple } = this.props
    
    let fileEntries = []
    let queue = []
    
    if (allowMultiple) {
      for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry())
      }
    } else {
      queue.push(dataTransferItemList[0].webkitGetAsEntry())
    }
    
    while (queue.length > 0) {
      let entry = queue.shift()
      if (entry.isFile) {
        fileEntries.push(entry)
      } else if (entry.isDirectory) {
        queue.push(...await this.readAllDirectoryEntries(entry.createReader()))
      }
      if (queue.length === 1) {
        return fileEntries
      }
    }
  }
  
  // Get all the entries (files or sub-directories) in a directory
  // by calling readEntries until it returns empty array
  readAllDirectoryEntries = async directoryReader => {
    let entries = []
    let readEntries = await this.readEntriesPromise(directoryReader)
    while (readEntries.length > 0) {
      entries.push(...readEntries)
      readEntries = await this.readEntriesPromise(directoryReader)
    }
    return entries
  }
  
  // Wrap readEntries in a promise to make working with readEntries easier
  // readEntries will return only some of the entries in a directory
  // e.g. Chrome returns at most 100 entries at a time
  readEntriesPromise = async directoryReader => {
    try {
      return await new Promise((resolve, reject) => directoryReader.readEntries(resolve, reject))
    } catch (err) {
      console.log(err)
    }
  }
  
  /**
   * Handle if the drag is a file or folder
   * @param e
   * @returns {Promise<void>}
   */
  onDrop = async e => {
    const { handleAddFiles, allowMultiple } = this.props
    
    e.persist()
    e.preventDefault()
    const fileEntries = await this.getAllFileEntries(e.dataTransfer.items)
    let files = []
    for (let i = 0; i < fileEntries.length; i++) {
      fileEntries[i].file(file => {
        files.push(file)
        if (i === fileEntries.length - 1) {
          handleAddFiles(allowMultiple ? files : files[0])
        }
      })
    }
  }
  
  /**
   * Handles when the user selects files via input field
   * @param e
   */
  onSelectFiles = e => {
    const { handleAddFiles, allowMultiple } = this.props
  
    let files = []
    Array.from(Array(e.target.files.length).keys()).map(x => files.push(e.target.files.item(x)))
    handleAddFiles(allowMultiple ? files : files[0])
  }
  
  /**
   * Stop the browser from opening the document
   * @param e
   */
  onDragOver = e => {
    e.preventDefault()
  }
  
  render() {
    const {
      buttonText,
      containerBgColor,
      containerBorderColor,
      containerStyle,
      containerText,
      allowMultiple,
      allowedFileTypes
    } = this.props
    
    const alertActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onContinueSelectExcel
      }
    ]
    
    return (
      <>
        <form
          style={{ margin: '20px 0', flex: 1 }}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          encType="multipart/form-data">
          <FlexGrid
            container
            type="row"
            align="center"
            justify="flex-start"
            style={{
              borderRadius: 4,
              height: 64,
              paddingLeft: 10,
              backgroundColor: containerBgColor,
              border: `3px dashed ${containerBorderColor}`,
              ...containerStyle
            }}>
            <Button
              raised
              color="white"
              textColor="black"
              onClick={this.handleInitiateFileSelector}
              value={buttonText}
            />
            <FlexGrid flex container type="row" style={{ position: 'relative', height: '100%' }}>
              <input
                ref={this.inputRef}
                multiple={allowMultiple}
                type="file"
                onChange={this.onSelectFiles}
                style={{ opacity: 0, height: '100%', width: '100%', position: 'absolute' }}
                accept={allowedFileTypes}
              />
              <Typography
                variant="body2"
                style={{ color: '#646465', marginLeft: 10, alignSelf: 'center' }}>
                {containerText}
              </Typography>
            </FlexGrid>
          </FlexGrid>
        </form>
        <Alert
          open={this.state.alertOpen}
          actions={alertActions}
          onCloseAlert={this.onCancelSelectExcel}
          title="Warning">
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Selecting a new Excel file will erase existing information. Do you want to continue?
          </Typography>
        </Alert>
        </>
    )
  }
}

export default FileUpload
