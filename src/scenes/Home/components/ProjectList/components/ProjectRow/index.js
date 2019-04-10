import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme } from 'material-ui/styles'
import TableRow from 'components/TableRow'
import Button from 'components/Button'
import Link from 'components/Link'
import TextLink from 'components/TextLink'
import IconButton from 'components/IconButton'
import TableCell from 'components/TableCell'
import * as actions from 'scenes/Home/actions'
import moment from 'moment'
import { commonHelpers } from 'utils'

export const ProjectRow = ({ project, role, bookmarked, actions, onExport, theme }) => {
  const isCoder = role === 'Coder'
  const greyIcon = theme.palette.greyText
  const generateKeyAndId = commonHelpers.generateUniqueProps(project.id)

  //const date = moment.parseZone(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')
  const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')
  return (
    <TableRow key={project.id} hover>
      <TableCell
        {...generateKeyAndId('bookmarked')}
        padding="checkbox"
        style={{ width: isCoder ? '1%' : 24, paddingLeft: 24 }}>
        <IconButton
          color={bookmarked ? '#fdc43b' : greyIcon}
          onClick={() => actions.toggleBookmark(project)}
          tooltipText="Bookmark project"
          aria-label="Bookmark this project"
          id={`bookmark-project-${project.id}`}>
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </TableCell>
      <TableCell {...generateKeyAndId('name')} style={{ paddingRight: 24, width: '15%' }}>
        <TextLink
          aria-label="Edit project details"
          to={{ pathname: `/project/edit/${project.id}`, state: { projectDefined: { ...project }, modal: true } }}>
          {project.name}
        </TextLink>
      </TableCell>
      <TableCell
        {...generateKeyAndId('dateLastEdited')}
        style={{ textAlign: 'unset', width: isCoder ? '15%' : 'unset', paddingRight: 24 }}>
        {date}
      </TableCell>
      <TableCell {...generateKeyAndId('lastEditedBy')} style={{ width: isCoder ? '15%' : 'unset', paddingRight: 24 }}>
        {project.lastEditedBy}
      </TableCell>
      <TableCell
        {...generateKeyAndId('protocol')}
        style={{ width: isCoder ? '15%' : 'unset', textAlign: 'center', paddingRight: 24 }}>
        <TextLink aria-label="Add and edit project protocol" to={`/project/${project.id}/protocol`}>Edit</TextLink>
      </TableCell>
      {!isCoder &&
      <TableCell {...generateKeyAndId('jurisdictions')} style={{ textAlign: 'center', paddingRight: 24 }}>
        <TextLink
          aria-label="Add and edit project jurisdictions"
          to={{ pathname: `/project/${project.id}/jurisdictions`, state: { modal: true } }}
          id={`${project.id}-edit-jurisdictions`}>Edit</TextLink>
      </TableCell>
      }
      {!isCoder &&
      <TableCell {...generateKeyAndId('coding-scheme')} style={{ textAlign: 'center', paddingRight: 24 }}>
        <TextLink
          aria-label="Add and edit project coding scheme"
          to={`/project/${project.id}/coding-scheme`}>Edit</TextLink>
      </TableCell>
      }
      <TableCell
        {...generateKeyAndId('code')}
        padding="checkbox"
        style={{ width: isCoder ? '15%' : 56, paddingRight: 6, textAlign: isCoder ? 'center' : 'unset' }}>
        <Button
          raised={false}
          value="Code"
          listButton
          aria-label="Code project"
          component={Link}
          to={{ pathname: `/project/${project.id}/code` }} />
      </TableCell>
      {!isCoder &&
      <TableCell {...generateKeyAndId('validate')} padding="checkbox" style={{ width: 56, paddingLeft: 6 }}>
        <Button
          raised={false}
          value="Validate"
          listButton
          aria-label="Validate project"
          component={Link}
          to={{ pathname: `/project/${project.id}/validate` }} />
      </TableCell>
      }
      {!isCoder && <TableCell
        {...generateKeyAndId('export')}
        style={{ paddingRight: 24, width: 40, paddingLeft: 0, textAlign: 'center' }}>
        <IconButton
          color={greyIcon}
          tooltipText="Export validated questions"
          placement="top-end"
          aria-label="Export validated questions"
          onClick={() => onExport(project)}
          id={`export-validated-${project.id}`}>
          file_download
        </IconButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(ProjectRow))
