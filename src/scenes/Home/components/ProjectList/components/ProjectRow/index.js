import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TableRow from 'components/TableRow'
import Button from 'components/Button'
import TextLink from 'components/TextLink'
import IconButton from 'components/IconButton'
import TableCell from 'components/TableCell'
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
      <TableCell key={`${project.id}-name`} style={{ textAlign: 'left', width: 350, fontWeight: 'normal' }}>
        <TextLink to={{ pathname: `/project/edit/${project.id}`, state: { projectDefined: { ...project } } }}>{project.name}</TextLink>
      </TableCell>
      <TableCell key={`${project.id}-dateLastEdited`}
        style={{ width: 150, maxWidth: 150, textAlign: 'unset' }}>
        {new Date(project.dateLastEdited).toLocaleDateString()}
      </TableCell>
      <TableCell
        key={`${project.id}-lastEditedBy`}
        style={{ fontStyle: 'italic', width: 150, maxWidth: 150, textAlign: 'unset' }}
      >
        {project.lastEditedBy}
      </TableCell>
      {role !== 'Coder' &&
        <TableCell key={`${project.id}-protocol`} style={{ textAlign: 'center' }}>
          <TextLink to="/">Add/Edit</TextLink>
        </TableCell>
      }
      <TableCell key={`${project.id}-jurisdictions`} style={{ textAlign: 'center' }}>
        <TextLink to={`/project/${project.id}/jurisdictions`} id={project.id}>Add/Edit</TextLink>
      </TableCell>
      {role !== 'Coder' &&
        <TableCell key={`${project.id}-codingScheme`} >
          <TextLink to={`/project/${project.id}/coding-scheme`}>Edit</TextLink>
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
