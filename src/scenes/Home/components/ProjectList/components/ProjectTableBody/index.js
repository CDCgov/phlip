import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import Button from 'components/Button'
import TextLink from 'components/TextLink'
import IconButton from 'components/IconButton'
import TableCell from 'components/TableCell'

const greyIcon = '#d4d4d4'

const ProjectTableBody = ({ bookmarkList, projects, user, onToggleBookmark, onExport }) => {
  return (
    projects.map(project => (
      <TableRow key={project.id}>
        <TableCell key={`${project.id}-bookmarked`} style={{ width: 48 }}>
          <IconButton color={bookmarkList.includes(project.id) ? '#fdc43b' : greyIcon} onClick={() => onToggleBookmark(project)}>
            {bookmarkList.includes(project.id) ? 'bookmark' : 'bookmark_border'}
          </IconButton>
        </TableCell>
        <TableCell key={`${project.id}-name`} style={{ textAlign: 'left', maxWidth: 'unset' }}>
          <TextLink to="/">{project.name}</TextLink>
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
        {user.role !== 'Coder' &&
        <TableCell key={`${project.id}-jurisdictions`} light>
          <TextLink to="/">Add/Edit</TextLink>
        </TableCell>
        }
        <TableCell key={`${project.id}-protocol`} light>
          <TextLink to="/">Add/Edit</TextLink>
        </TableCell>
        {user.role !== 'Coder' &&
        <TableCell key={`${project.id}-codingScheme`} light>
          <TextLink to="/">Edit</TextLink>
        </TableCell>
        }
        <TableCell key={`${project.id}-code`} style={{ maxWidth: 40 }}>
          <Button raised={false} value="Code" listButton />
        </TableCell>
        {user.role !== 'Coder' &&
        <TableCell key={`${project.id}-validation`} style={{ maxWidth: 40 }}>
          <Button raised={false} value="Validate" listButton />
        </TableCell>
        }
        <TableCell key={`${project.id}-export`} style={{ maxWidth: 10 }}>
          <IconButton color={greyIcon} onClick={() => onExport()}>file_download</IconButton>
        </TableCell>
      </TableRow>
    ))
  )
}

ProjectTableBody.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  onToggleBookmark: PropTypes.func,
  onExport: PropTypes.func
}

export default ProjectTableBody
