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

const greyIcon = '#b1b3b3'

export const ProjectRow = ({ project, role, bookmarked, actions, onExport }) => {
  return (
    <TableRow key={project.id}>
      <TableCell key={`${project.id}-bookmarked`} padding="checkbox" style={{ width: 24 }}>
        <IconButton
          color={bookmarked ? '#fdc43b' : greyIcon}
          onClick={() => actions.toggleBookmark(project)}
          tooltipText="Bookmark project"
          aria-label="Bookmark this project"
          id="bookmark-project">
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </TableCell>
      <TableCell key={`${project.id}-name`} style={{ paddingRight: 24, width: '15%' }}>
        <TextLink
          aria-label="Edit project details" to={{
          pathname: `/project/edit/${project.id}`,
          state: { projectDefined: { ...project } }
        }}>{project.name}</TextLink>
      </TableCell>
      <TableCell
        key={`${project.id}-dateLastEdited`} style={{ textAlign: 'unset', paddingRight: 24 }}>
        {new Date(project.dateLastEdited).toLocaleDateString()}
      </TableCell>
      <TableCell key={`${project.id}-lastEditedBy`} style={{ paddingRight: 24 }}>
        {project.lastEditedBy}
      </TableCell>
      <TableCell key={`${project.id}-protocol`} style={{ textAlign: 'center', paddingRight: 24 }}>
        <TextLink aria-label="Add and edit project protocol" to={`/project/${project.id}/protocol`}>Edit</TextLink>
      </TableCell>
      {role !== 'Coder' &&
      <TableCell key={`${project.id}-jurisdictions`} style={{ textAlign: 'center', paddingRight: 24 }}>
        <TextLink
          aria-label="Add and edit project jurisdictions"
          to={`/project/${project.id}/jurisdictions`}
          id={project.id}>Edit</TextLink>
      </TableCell>
      }
      {role !== 'Coder' &&
      <TableCell key={`${project.id}-codingScheme`} style={{ textAlign: 'center', paddingRight: 24 }}>
        <TextLink
          aria-label="Add and edit project coding scheme"
          to={`/project/${project.id}/coding-scheme`}>Edit</TextLink>
      </TableCell>
      }
      <TableCell key={`${project.id}-code`} padding="checkbox" style={{ width: 56, paddingRight: 6 }}>
        <TextLink to={{ pathname: `/project/${project.id}/code` }}>
          <Button raised={false} value="Code" listButton aria-label="Code project" />
        </TextLink>
      </TableCell>
      {role !== 'Coder' &&
      <TableCell key={`${project.id}-validation`} padding="checkbox" style={{ width: 56, paddingLeft: 6 }}>
        <TextLink to={{ pathname: `/project/${project.id}/validate` }}>
          <Button raised={false} value="Validate" listButton aria-label="Validate project" />
        </TextLink>
      </TableCell>
      }
      {role !== 'Coder' && <TableCell key={`${project.id}-export`} style={{ paddingRight: 24, width: 40, paddingLeft: 0, textAlign: 'center' }}>
        {/*<TextLink
          //target="_blank"
          to={{ pathname: `/project/${project.id}/export` }}
          //to={{ pathname: `/api/exports/project/${project.id}/data`}}
        >*/}
          <IconButton
            color={greyIcon}
            tooltipText="Export validated questions"
            placement="top-end"
            aria-label="Export validated questions"
            onClick={() => onExport(project.id)}
            id="export-validated">
            file_download
          </IconButton>{/*</TextLink>*/}
      </TableCell>}
    </TableRow>
  )
}

ProjectRow.propTypes = {}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.id],
  role: state.data.user.currentUser.role,
  bookmarked: state.scenes.home.main.bookmarkList.includes(ownProps.id)
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRow)
