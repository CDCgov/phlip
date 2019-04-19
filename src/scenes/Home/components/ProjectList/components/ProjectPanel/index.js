import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme } from '@material-ui/core/styles'
import actions from 'scenes/Home/actions'
import moment from 'moment'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { FlexGrid, IconButton, TextLink, Link, Button } from 'components'
import { FileDocument, City, FormatListBulleted, ClipboardCheckOutline, FileExport } from 'mdi-material-ui'

export class ProjectPanel extends Component {
  static propTypes = {
    project: PropTypes.object,
    actions: PropTypes.object,
    role: PropTypes.string,
    theme: PropTypes.object,
    expanded: PropTypes.bool,
    users: PropTypes.array,
    allUsers: PropTypes.object,
    bookmarked: PropTypes.bool,
    onExport: PropTypes.func,
    length: PropTypes.number,
    index: PropTypes.number,
    handleExpandProject: PropTypes.func
  }

  handleChange = event => {
    this.props.actions.getProjectUsers(this.props.project.id, {
      id: this.props.project.createdById,
      email: this.props.project.createdByEmail
    })
    this.props.handleExpandProject(this.props.project.id, event)
  }

  determineGridSize = () => {
    let size = 0, square = 0, i = 0
    const { users } = this.props

    while (size === 0) {
      const sq = i ** 2
      if (users.length <= sq) {
        square = sq
        size = i
      }
      i++
    }

    return { square, size }
  }

  populateUsers = square => {
    const { users, project } = this.props
    if (square === users.length) {
      return [...users]
    }

    const userTiles = [...users]
    const blanks = Array.from({ length: square - users.length }, (v, i) => ({
      id: `${project.id}-blank-${i}`,
      blank: true
    }))
    return userTiles.concat(blanks)
  }

  render() {
    const {
      project, role, bookmarked, actions, onExport, theme, index, length, users, allUsers, expanded
    } = this.props

    console.log(actions)

    const isCoder = role === 'Coder'
    const greyIcon = theme.palette.greyText
    const iconStyle = { fontSize: 18, paddingLeft: 5 }
    const listingStyle = { fontSize: 14, fontWeight: 500, color: '#7b7b7b' }
    const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
    const createdDate = moment.utc(project.dateCreated).local().format('M/D/YYYY')

    const { square, size } = this.determineGridSize()
    const userData = expanded ? this.populateUsers(square) : []
    const avatarCols = size, avatarRows = size, cellHeight = 300 / size

    const rowStyles = {
      boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
      position: 'relative',
      backgroundColor: 'white',
      fontSize: '0.8125rem',
      borderRadius: expanded ? 2 : 0,
      cursor: 'pointer'
    }

    const collapseStyles = {
      transitionDuration: '150ms',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%'
    }

    const expandedStyles = {
      minHeight: 60
    }

    const containerStyles = {
      paddingBottom: (index === 0 || index < length)
        ? expanded
          ? 30
          : 0
        : 0,
      paddingTop: expanded
        ? (index === length - 1 || index > 0)
          ? 30
          : 0
        : 0
    }

    const panelButtonProps = {
      style: { marginLeft: 10 },
      color: 'white',
      textColor: 'black',
      disableRipple: true
    }

    return (
      <FlexGrid style={containerStyles} onClick={this.handleChange}>
        <FlexGrid container justify="center" style={rowStyles} flex>
          {!expanded && <FlexGrid type="row" container flex style={expandedStyles}>
            <FlexGrid container type="row" align="center" padding="0 0 0 24px" style={{ width: '24px' }}>
              <IconButton
                color={this.props.bookmarked ? '#fdc43b' : greyIcon}
                onClick={() => actions.toggleBookmark(project)}
                tooltipText="Bookmark project"
                aria-label="Bookmark this project"
                id={`bookmark-project-${project.id}`}>
                {bookmarked ? 'bookmark' : 'bookmark_border'}
              </IconButton>
            </FlexGrid>
            <FlexGrid padding="0 12px" container type="row" align="center" style={{ flexBasis: '32%' }}>
              <TextLink
                aria-label="Edit project details"
                to={{
                  pathname: `/project/edit/${project.id}`,
                  state: { projectDefined: { ...project }, modal: true }
                }}>
                {project.name}
              </TextLink>
            </FlexGrid>
            <FlexGrid container type="row" align="center" flex style={{ flexBasis: '30%' }}>
              <FlexGrid style={{ width: '49%' }}>
                <span style={{ color: 'black' }}>Date Last Edited:{' '}</span>
                <span>{date}</span>
              </FlexGrid>
              <span style={{ width: '2%' }} />
              <FlexGrid style={{ width: '49%' }}>
                <span style={{ color: 'black' }}>Last Edited By:{' '}</span>
                {project.lastEditedBy}
              </FlexGrid>
            </FlexGrid>
            <FlexGrid
              flex
              container
              padding="0 44px 0 0"
              type="row"
              align="center"
              justify="flex-end"
              style={{ flexBasis: '30%' }}>
              <Button
                raised={false}
                value="Code"
                listButton
                style={{ borderRadius: 3 }}
                aria-label="Code project"
                component={Link}
                to={{ pathname: `/project/${project.id}/code` }}
              />
              <span style={{ width: '24px' }} />
              <Button
                raised={false}
                value="Validate"
                listButton
                aria-label="Validate project"
                component={Link}
                style={{ borderRadius: 3 }}
                to={{ pathname: `/project/${project.id}/validate` }}
              />
            </FlexGrid>
          </FlexGrid>}
          <Collapse in={expanded} style={collapseStyles}>
            <FlexGrid container type="row" style={{ width: '100%', overflow: 'auto' }}>
              <FlexGrid container type="column">
                <GridList
                  style={{ width: 300, height: '100%', margin: 0 }}
                  cellHeight={cellHeight}
                  spacing={2}
                  cols={avatarCols}
                  rows={avatarRows}>
                  {userData.map(oneCoder => {
                    const coder = oneCoder.blank
                      ? oneCoder
                      : allUsers[oneCoder.userId] !== undefined
                        ? allUsers[oneCoder.userId]
                        : oneCoder
                    return (
                      <GridListTile cols={1} key={coder.id || coder.userId}>
                        {coder.avatar !== undefined ? (
                          coder.avatar === '' ? (
                            <FlexGrid
                              container
                              type="row"
                              justify="center"
                              align="center"
                              title={coder.username}
                              style={{ backgroundColor: theme.palette.secondary.main, height: '100%' }}>
                              <Typography style={{ fontWeight: 300, fontSize: 30, color: 'white' }}>
                                {coder.initials}
                              </Typography>
                            </FlexGrid>
                          ) : (
                            <img alt={`avatar-${coder.lastName}`} src={coder.avatar} title={coder.username} />
                          )
                        ) : <div style={{ backgroundColor: '#f9f9f9', height: '100%' }} />}
                      </GridListTile>
                    )
                  })}
                </GridList>
              </FlexGrid>
              <FlexGrid container type="column" flex>
                <FlexGrid container type="row" align="center" padding={30} style={{ backgroundColor: '#f9f9f9' }}>
                  <FlexGrid
                    container
                    type="row"
                    flex
                    align="center"
                    justify="flex-start"
                    style={{ fontSize: 20, minWidth: 150 }}>
                    <IconButton
                      color={bookmarked ? '#fdc43b' : greyIcon}
                      onClick={() => actions.toggleBookmark(project)}
                      tooltipText="Bookmark project"
                      aria-label="Bookmark this project"
                      id={`bookmark-project-${project.id}`}>
                      {bookmarked ? 'bookmark' : 'bookmark_border'}
                    </IconButton>
                    <FlexGrid padding="checkbox" style={{ width: 20 }} />
                    <TextLink
                      aria-label="Edit project details"
                      to={{
                        pathname: `/project/edit/${project.id}`,
                        state: { projectDefined: { ...project }, modal: true }
                      }}>
                      {project.name}
                    </TextLink>
                  </FlexGrid>
                  <FlexGrid container type="row" flex justify="flex-end" align="stretch" style={{ height: 40 }}>
                    {!isCoder && (<Button
                      id={`${project.id}-edit-jurisdictions`}
                      to={{ pathname: `/project/${project.id}/jurisdictions`, state: { modal: true } }}
                      aria-label="Add and edit project jurisdictions"
                      component={Link}
                      {...panelButtonProps}>
                      Jurisdictions
                      <City style={iconStyle} />
                    </Button>)}
                    <Button
                      aria-label="Documents in this project"
                      {...panelButtonProps}
                      component={Link}
                      to={{ pathname: `/docs`, state: { projectDefined: true, project } }}>
                      Documents
                      <FileDocument style={iconStyle} />
                    </Button>
                    {!isCoder && (<Button
                      component={Link}
                      aria-label="Add and edit project coding scheme"
                      to={`/project/${project.id}/coding-scheme`}
                      {...panelButtonProps}>
                      Coding Scheme
                      <FormatListBulleted style={iconStyle} />
                    </Button>)}
                    <Button
                      component={Link}
                      aria-label="Add and edit project protocol"
                      to={`/project/${project.id}/protocol`}
                      {...panelButtonProps}>
                      Protocol
                      <ClipboardCheckOutline style={iconStyle} />
                    </Button>
                    <Button
                      aria-label="Export validated questions"
                      onClick={() => onExport(project)}
                      id={`export-validated-${project.id}`}
                      {...panelButtonProps}>
                      Export
                      <FileExport style={iconStyle} />
                    </Button>
                  </FlexGrid>
                </FlexGrid>
                <FlexGrid container type="row">
                  <FlexGrid container flex padding={30}>
                    <Typography variant="body1" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Created by:{' '}</span>
                      {project.createdBy} -{' '}
                      <span style={{ fontSize: `0.8rem`, color: '#7b7b7b' }}>{createdDate}</span>
                    </Typography>
                    <Typography variant="body1" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Last edited by:{' '}</span>
                      {project.lastEditedBy} -{' '}
                      <span style={{ fontSize: `0.8rem`, color: '#7b7b7b' }}>{date}</span>
                    </Typography>
                    <Typography variant="body1" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Coordinator(s):{' '}</span>
                      <span>
                        {users.filter((oneCoder) => {
                          return oneCoder.role !== 'Coder'
                        }).map((oneCoder) => {
                          return oneCoder.firstName + ' ' + oneCoder.lastName
                        }).join(', ')}
                      </span>
                    </Typography>
                    <Typography variant="body1" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Coder(s):{' '}</span>
                      <span>
                        {users.filter((oneCoder) => {
                          return oneCoder.role === 'Coder'
                        }).map((oneCoder) => {
                          return oneCoder.firstName + ' ' + oneCoder.lastName
                        }).join(', ')}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <span style={listingStyle}>Type:{' '}</span>
                      <span>{(project.type === 1) ? 'Legal Scan' : 'Policy Surveillance'}</span>
                    </Typography>
                    <FlexGrid />
                  </FlexGrid>
                  <FlexGrid container type="row" align="flex-end" flex padding={30} justify="flex-end">
                    <Button
                      raised={false}
                      value="Code"
                      listButton
                      aria-label="Code project"
                      component={Link}
                      to={{ pathname: `/project/${project.id}/code` }}
                      style={{ width: 150, height: 50, marginRight: 20, borderRadius: 3 }}
                    />
                    {!isCoder &&
                    <Button
                      raised={false}
                      value="Validate"
                      listButton
                      aria-label="Validate project"
                      component={Link}
                      to={{ pathname: `/project/${project.id}/validate` }}
                      style={{ width: 150, height: 50, borderRadius: 3 }}
                    />}
                  </FlexGrid>
                </FlexGrid>
              </FlexGrid>
            </FlexGrid>
          </Collapse>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const homeState = state.scenes.home.main
  const p = homeState.projects.byId[ownProps.id]
  return {
    project: p,
    role: state.data.user.currentUser.role,
    bookmarked: homeState.bookmarkList.includes(ownProps.id),
    users: p.projectUsers,
    allUsers: state.data.user.byId
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(ProjectPanel))
