import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import Grid from 'components/Grid'
import Typography from '@material-ui/core/Typography'
import SimpleInput from 'components/SimpleInput'
import IconButton from 'components/IconButton'

const fileTypeIcons = {
  'pdf': 'picture_as_pdf',
  'doc.*|rtf': 'library_books',
  'png|jpe?g|tiff': 'insert_photo'
}

const getIconType = extension => {
  let icon = 'library_books'

  for (const type in fileTypeIcons) {
    const regex = new RegExp(type, 'g')
    if (extension.match(regex) !== null) {
      icon = fileTypeIcons[type]
    }
  }
  return icon
}

const FileRow = props => {
  const { name, tags, onChangeProperty, onRemoveDoc, index } = props
  const pieces = name.split('.')
  const extension = pieces[pieces.length - 1]
  const iconName = getIconType(extension)

  const bgColor = index % 2 === 0 ? '#f9f9f9' : '#fff'

  return (
    <Grid container type="row" align="center" padding="10px 0" style={{ backgroundColor: bgColor }}>
      <Icon size={32} style={{ padding: '0 20px' }}>{iconName}</Icon>
      <Grid flex container style={{ display: 'inline-flex', position: 'relative', width: '30%' }}>
        <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
          File Name
        </Typography>
        <Typography>{name}</Typography>
      </Grid>
      <Grid flex container type="row" align="flex-end" style={{ margin: '0 0 0 20px' }}>
        <Icon color="#949494" style={{ marginRight: 5, marginBottom: 3 }}>local_offer</Icon>
        <SimpleInput
          label="Tags"
          value=""
          multiline={false}
          shrinkLabel
          placeholder="Enter tags"
          onChange={value => onChangeProperty(index, 'tags', value)}
        />
      </Grid>
      <IconButton style={{ margin: '0 20px' }} onClick={() => onRemoveDoc(index)} iconSize={24} color="primary">
        cancel
      </IconButton>
    </Grid>
  )
}

FileRow.propTypes = {
  /**
   * Name of the file
   */
  name: PropTypes.string,

  /**
   * Function when the user wants to change a property of the file
   */
  onChangeProperty: PropTypes.func,

  /**
   * Function called when a user wants to remove the file
   */
  onRemoveDoc: PropTypes.func,

  /**
   * Index of the file
   */
  index: PropTypes.number,

  /**
   * Tags added to the file
   */
  tags: PropTypes.array
}

FileRow.defaultProps = {
  name: '',
  index: 0,
  tags: []
}

export default FileRow