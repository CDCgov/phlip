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
  
  render() {
    const {
      handleAddFiles,
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
        <form encType="multipart/form-data" style={{ margin: '20px 0', flex: 1 }}>
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
                onChange={handleAddFiles}
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
