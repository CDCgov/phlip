import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TableRow from 'components/TableRow/index'
import Button from 'components/Button/index'
import TextLink from 'components/TextLink/index'
import IconButton from 'components/IconButton/index'
import TableCell from 'components/TableCell/index'
import * as actions from 'scenes/Home/actions'

const greyIcon = '#d4d4d4'

export const ProjectRow = ({ project, role, bookmarked, actions }) => {
  return (
      <TableRow key={project.id}>
        <TableCell key={`${project.id}-bookmarked`} style={{ width: 48 }}>
          <IconButton color={bookmarked ? '#fdc43b' : greyIcon} onClick={() => actions.toggleBookmark(project)}>
            {bookmarked ? 'bookmark' : 'bookmark_border'}
          </IconButton>
        </TableCell>
        <TableCell key={`${project.id}-name`} style={{ textAlign: 'left', width: 350 }}>
          <TextLink to={{ pathname: `/project/edit/${project.id}`, state: { projectDefined: { ...project }} }}>{project.name}</TextLink>
        </TableCell>
        <TableCell key={`${project.id}-dateLastEdited`}
                   style={{ color: '#9a9c9c', width: 150, maxWidth: 150, textAlign: 'unset' }} light>
          {new Date(project.dateLastEdited).toLocaleDateString()}
        </TableCell>
        <TableCell
          key={`${project.id}-lastEditedBy`}
          style={{ color: '#9a9c9c', fontStyle: 'italic', width: 150, maxWidth: 150, textAlign: 'unset' }}
          light
        >
          {project.lastEditedBy}
        </TableCell>
        {role !== 'Coder' &&
          <TableCell key={`${project.id}-protocol`} light>
            <TextLink to="/">Add/Edit</TextLink>
          </TableCell>
        }
        <TableCell key={`${project.id}-jurisdictions`} light>
          <TextLink to={`/project/${project.id}/jurisdictions`} id={project.id}>Add/Edit</TextLink>
        </TableCell>
        {role !== 'Coder' &&
        <TableCell key={`${project.id}-codingScheme`} light>
          <TextLink to="/">Edit</TextLink>
        </TableCell>
        }
        <TableCell key={`${project.id}-code`}>
          <Button raised={false} value="Code" listButton />
        </TableCell>
        {role !== 'Coder' &&
        <TableCell key={`${project.id}-validation`}>
          <Button raised={false} value="Validate" listButton />
        </TableCell>
        }
        <TableCell key={`${project.id}-export`}>
          <IconButton color={greyIcon} onClick={() => actions.onExport}>file_download</IconButton>
        </TableCell>
      </TableRow>
  )
}

ProjectRow.propTypes = {
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.id],
  role: state.data.user.currentUser.role,
  bookmarked: state.scenes.home.main.bookmarkList.includes(ownProps.id)
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRow)
