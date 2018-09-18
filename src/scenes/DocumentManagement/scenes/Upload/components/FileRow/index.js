import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import Grid from 'components/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from 'components/IconButton'
import ChipInput from 'material-ui-chip-input'
import Chip from 'components/Chip'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  chipContainer: {
    marginBottom: 0,
    display: 'inline-flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: 'unset',
    paddingBottom: 2
  },
  chip: {
    margin: '0 8px 2px 0'
  }
}

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
  const { name, tags, onAddTag, onRemoveTag, onRemoveDoc, index } = props
  const pieces = name.split('.')
  const extension = pieces[pieces.length - 1]
  const iconName = getIconType(extension)

  const bgColor = index % 2 === 0 ? '#f9f9f9' : '#fff'

  return (
    <Grid container type="row" align="center" padding="10px 0" style={{ backgroundColor: bgColor }}>
      <Icon size={32} style={{ padding: '0 20px' }}>{iconName}</Icon>
      <Grid
        flex
        container
        style={{ display: 'inline-flex', position: 'relative', minWidth: '40%', maxWidth: '40%' }}>
        <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
          File Name
        </Typography>
        <Typography>{name}</Typography>
      </Grid>
      <Grid flex container type="row" align="flex-end" style={{ margin: '0 0 0 20px' }}>
        <Icon color="#949494" size={28} style={{ marginRight: 5 }}>local_offer</Icon>
        <Grid flex container style={{ display: 'inline-flex', position: 'relative' }}>
          <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
            Tags
          </Typography>
          <ChipInput
            value={tags}
            fullWidth
            onAdd={chip => onAddTag(index, chip)}
            onDelete={(chip, tagIndex) => onRemoveTag(index, chip, tagIndex)}
            placeholder="Enter tags"
            chipRenderer={Chip}
            classes={{
              chipContainer: props.classes.chipContainer,
              chip: props.classes.chip
            }}
            color="secondary"
          />
        </Grid>
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

export default withStyles(styles)(FileRow)