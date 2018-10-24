import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Button from 'components/Button'
import Typography from '@material-ui/core/Typography/Typography'

/**
 * The blue container where files can be uploaded
 */
export const InputFileContainer = props => {
  const {
    handleInitiateFileSelecter, handleAddFilesToList, inputRef, buttonText, containerStyle, multiple, fileTypes
  } = props

  return (
    <form encType="multipart/form-data" style={{ margin: '20px 0', flex: 1 }}>
      <Grid
        container
        type="row"
        align="center"
        justify="flex-start"
        style={{
          borderRadius: 4,
          height: 64,
          paddingLeft: 10,
          ...containerStyle
        }}>
        <Button
          raised
          color="white"
          textColor="black"
          onClick={handleInitiateFileSelecter}
          value={buttonText}
        />
        <Grid flex container type="row" style={{ position: 'relative', height: '100%' }}>
          <input
            ref={inputRef}
            multiple={multiple}
            type="file"
            onChange={handleAddFilesToList}
            style={{ opacity: 0, height: '100%', width: '100%', position: 'absolute' }}
            accept={fileTypes}
          />
          <Typography
            variant="body2"
            style={{ color: '#646465', marginLeft: 10, alignSelf: 'center' }}>
            or drag and drop here
          </Typography>
        </Grid>
      </Grid>
    </form>
  )
}

InputFileContainer.propTypes = {
  /**
   * Called when the user has actually selected files
   */
  handleAddFilesToList: PropTypes.func,

  /**
   * Initiates the file selecter modal
   */
  handleInitiateFileSelecter: PropTypes.func,

  /**
   * Ref created by Upload component to send to the <input> element
   */
  inputRef: PropTypes.object
}

export default InputFileContainer