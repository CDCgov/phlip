import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, IconButton } from 'components'
import moment from 'moment'
import theme from 'services/theme'

export const ProjectRow = props => {
  const { project, bookmarked, toggleBookmark, handleExpandProject } = props
  const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
  const greyIcon = theme.palette.greyText
  
  return (
    <FlexGrid type="row" container flex style={{ minHeight: 60 }} onClick={handleExpandProject}>
      <FlexGrid container type="row" align="center" padding="0 0 0 24px" style={{ width: '24px' }}>
        <IconButton
          color={bookmarked ? '#fdc43b' : greyIcon}
          onClick={event => {
            event.stopPropagation()
            toggleBookmark(project)
          }}
          tooltipText="Bookmark project"
          aria-label="Bookmark this project"
          id={`bookmark-project-${project.id}`}>
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </FlexGrid>
      <FlexGrid padding="0 12px" container type="row" align="center" flex style={{ flexBasis: '32%' }}>
        <span>{project.name}</span>
      </FlexGrid>
      <FlexGrid
        container
        type="row"
        align="center"
        justify="flex-end"
        padding="0 24px 0 0"
        flex
        style={{ flexBasis: '10%' }}>
        <FlexGrid style={{ width: '45%' }}>
          <span style={{ color: 'black' }}>Date Last Edited:{' '}</span>
          <span>{date}</span>
        </FlexGrid>
        <span style={{ width: '8%' }} />
        <FlexGrid style={{ width: '45%' }}>
          <span style={{ color: 'black' }}>Last Edited By:{' '}</span>
          {project.lastEditedBy}
        </FlexGrid>
      </FlexGrid>
      {/*<FlexGrid*/}
      {/*  flex*/}
      {/*  container*/}
      {/*  padding="0 44px 0 0"*/}
      {/*  type="row"*/}
      {/*  align="center"*/}
      {/*  justify="flex-end"*/}
      {/*  style={{ flexBasis: '30%' }}>*/}
      {/*  <Button*/}
      {/*    raised={false}*/}
      {/*    value="Code"*/}
      {/*    listButton*/}
      {/*    style={{ borderRadius: 3 }}*/}
      {/*    aria-label="Code project"*/}
      {/*    component={Link}*/}
      {/*    to={{ pathname: `/project/${project.id}/code` }}*/}
      {/*  />*/}
      {/*  <span style={{ width: '24px' }} />*/}
      {/*  {!isCoder && <Button*/}
      {/*    raised={false}*/}
      {/*    value="Validate"*/}
      {/*    listButton*/}
      {/*    aria-label="Validate project"*/}
      {/*    component={Link}*/}
      {/*    style={{ borderRadius: 3 }}*/}
      {/*    to={{ pathname: `/project/${project.id}/validate` }}*/}
      {/*  />}*/}
      {/*</FlexGrid>*/}
    </FlexGrid>
  )
}

ProjectRow.propTypes = {
  project: PropTypes.object,
  bookmarked: PropTypes.bool,
  isCoder: PropTypes.bool,
  toggleBookmark: PropTypes.func,
  handleExpandProject: PropTypes.func
}

export default ProjectRow
