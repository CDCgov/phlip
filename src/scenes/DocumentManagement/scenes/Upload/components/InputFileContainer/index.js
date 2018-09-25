import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Button from 'components/Button'
import Typography from '@material-ui/core/Typography/Typography'

/**
 * The blue container where files can be uploaded
 */
export const InputFileContainer = props => {
  const { handleInitiateFileSelecter, handleAddFilesToList, handleDropFilesToList, inputRef } = props

  return (
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
          onClick={handleInitiateFileSelecter}
          value="Select files"
        />
        <Grid flex container type="row" style={{ position: 'relative', height: '100%' }}>
          <input
            ref={inputRef}
            multiple
            type="file"
            onChange={handleAddFilesToList}
            onDrop={handleDropFilesToList}
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