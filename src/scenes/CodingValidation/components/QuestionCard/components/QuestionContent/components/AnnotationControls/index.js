import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, IconButton } from 'components'
import { Eye, GreasePencil } from 'mdi-material-ui'
import theme from 'services/theme'

const AnnotationControls = props => {
  const {
    onToggleViewAnnotations, onToggleAnnotationMode, answerId, viewEnabled, annoModeEnabled, viewButtonDisabled,
    annoModeButtonDisabled
  } = props
  const iconColor = 'white'
  const selectedColor = theme.palette.error.main
  
  return (
    <FlexGrid
      container
      style={{
        borderRadius: '10%',
        marginLeft: 10,
        padding: '0 5px 5px 5px'
      }}
      align="center"
      justify="center">
      <FlexGrid
        raised={!viewButtonDisabled}
        align="center"
        container
        type="row"
        justify="center"
        style={{
          backgroundColor: viewEnabled ? selectedColor : viewButtonDisabled ? '#bfbfbf' : '#757575',
          width: 30,
          height: 30,
          borderRadius: 2
        }}>
        <IconButton
          onClick={onToggleViewAnnotations(answerId)}
          tooltipText="View Annotations"
          iconSize={20}
          disabled={viewButtonDisabled}>
          <Eye style={{ color: iconColor, fontSize: 20 }} />
        </IconButton>
      </FlexGrid>
      <FlexGrid
        align="center"
        container
        raised={!annoModeButtonDisabled}
        type="row"
        justify="center"
        style={{
          backgroundColor: annoModeEnabled ? selectedColor : annoModeButtonDisabled ? '#bfbfbf' : '#757575',
          width: 30,
          height: 30,
          marginTop: 5,
          borderRadius: 2
        }}>
        <IconButton
          onClick={onToggleAnnotationMode(answerId)}
          disabled={annoModeButtonDisabled}
          iconSize={18}
          tooltipText="Edit Annotations">
          <GreasePencil style={{ color: iconColor, fontSize: 18 }} />
        </IconButton>
      </FlexGrid>
    </FlexGrid>
  )
}

AnnotationControls.propTypes = {
  onToggleViewAnnotations: PropTypes.func,
  onToggleAnnotationMode: PropTypes.func,
  answerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  viewEnabled: PropTypes.bool,
  annoModeEnabled: PropTypes.bool,
  viewButtonDisabled: PropTypes.bool,
  annoModeButtonDisabled: PropTypes.bool
}

AnnotationControls.defaultProps = {
  showViewButton: true,
  showAnnoModeButton: true,
  viewButtonDisabled: false
}

export default AnnotationControls
