import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme, withStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import * as actions from 'scenes/Home/actions'
import moment from 'moment'
import { commonHelpers } from 'utils'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import { FlexGrid, IconButton, TextLink, Link, Button, Table } from 'components'
import { FileDocument, City, FormatListBulleted, ClipboardCheckOutline, FileExport } from 'mdi-material-ui'

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  expanded: {
    margin: '0px !important'
  }
})

class ProjectPanel extends Component {
  static propTypes = {
    project: PropTypes.object,
    actions: PropTypes.object,
    role: PropTypes.string,
    theme: PropTypes.object,
    classes: PropTypes.object.isRequired,
    expanded: PropTypes.bool,
    users: PropTypes.array
  }

  constructor(props) {
    super(props)
  }

  handleChange = panel => (event, expanded) => {
    if (expanded) {
      this.props.actions.getProjectUsers(this.props.project.id, {
        id: this.props.project.createdById,
        email: this.props.project.createdByEmail
      })
    }
  }

  handleClickAway = panel => (event, expanded) => {
    if (panel === undefined) {
      this.props.actions.resetOpenProject()
    }
  }

  render() {
    const {
      project, role, bookmarked, actions, onExport, theme, index, length, users, classes, allUsers, expanded
    } = this.props

    const isCoder = role === 'Coder'
    const greyIcon = theme.palette.greyText
    const iconStyle = { fontSize: 18, paddingLeft: 5 }
    const listingStyle = { fontSize: 14, fontWeight: 500, color: '#757575' }
    const generateKeyAndId = commonHelpers.generateUniqueProps(project.id)
    const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
    const createdDate = moment.utc(project.dateCreated).local().format('M/D/YYYY')
    let userData = [...users]
    let avatarCols = 1
    let avatarRows = 1
    let cellHeight = 130
    if (users.length >= 7) {
      avatarCols = 3
      avatarRows = 3
      cellHeight = 98
    } else if (users.length >= 5) {
      avatarCols = 3
      avatarRows = 3
      cellHeight = 100
      for (let i = 0; i < (9 - users.length); i++) {
        const blankAvatar = { id: Date.now() + i, blank: true }
        userData.push(blankAvatar)
      }
    } else if (users.length >= 2) {
      avatarCols = 2
      avatarRows = 2
      cellHeight = 150
      for (let i = 0; i < (4 - users.length); i++) {
        const blankAvatar = { id: Date.now() + i, blank: true }
        userData.push(blankAvatar)
      }
    } else if (users.length === 1) {
      avatarCols = 1
      cellHeight = 300
    }

    const cardStyle = {
      boxShadow: expanded
        ? theme.card.boxShadow
          ? index === 0
          : theme.card.topBoxShadow
        : theme.card.boxShadow,
      marginBottom: (index === 0 || index < length)
        ? expanded
          ? 30
          : 0
        : 0,
      marginTop: expanded
        ? (index === length - 1 || index > 0)
          ? 30
          : 0
        : 0,
      borderRadius: expanded ? 2 : 0
    }

    return (
      <FlexGrid style={cardStyle}>
        <ExpansionPanel
          expanded={expanded}
          style={{ borderRadius: 0, margin: 0 }}
          onChange={this.handleChange(project.id)}>
          <ExpansionPanelSummary style={{ padding: 0, margin: 0 }} classes={{ expanded: classes.expanded }}>
            {expanded ? (
              <FlexGrid container type="row" justify="space-between" style={{ width: '100%' }}>
                <FlexGrid container type="column">
                  <GridList
                    style={{ width: 300 }}
                    cellHeight={cellHeight}
                    cols={avatarCols}
                    rows={avatarRows}>
                    {userData.map(oneCoder => {
                      const coder = oneCoder.blank ? oneCoder : allUsers[oneCoder.userId]
                      return (
                        <GridListTile key={coder.id}>
                          {coder.avatar !== undefined ? (
                            coder.avatar === '' ? (
                              <FlexGrid
                                container
                                type="row"
                                justify="center"
                                align="center"
                                title={coder.username}
                                style={{ backgroundColor: '#686968', height: '100%' }}>
                                <Typography style={{ fontWeight: 500, fontSize: 45, color: 'white' }}>
                                  {coder.initials}
                                </Typography>
                              </FlexGrid>
                            ) : (
                              <img
                                alt={`avatar-${coder.lastName}`}
                                src={coder.avatar}
                                title={coder.username}
                              />
                            )
                          ) : <div style={{ backgroundColor: '#686968', height: '100%' }} />}
                        </GridListTile>
                      )
                    })}
                  </GridList>
                </FlexGrid>
                <FlexGrid container type="column" style={{ flex: '1 1 auto' }}>
                  <FlexGrid
                    container
                    type="row"
                    align="center"
                    padding={20}
                    style={{ backgroundColor: '#f9f9f9', height: 90 }}>
                    <FlexGrid container type="row" flex justify="flex-start" style={{ fontSize: 20 }}>
                      <IconButton
                        color={this.props.bookmarked ? '#fdc43b' : greyIcon}
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
                    <FlexGrid
                      container
                      type="row"
                      flex
                      justify="flex-end"
                      align="stretch"
                      style={{ height: 40, paddingRight: 10 }}>
                      {!isCoder && (<Button
                        id={`${project.id}-edit-jurisdictions`}
                        component={Link}
                        to={{ pathname: `/project/${project.id}/jurisdictions`, state: { modal: true } }}
                        disableRipple={true}
                        aria-label="Add and edit project jurisdictions"
                        color="white"
                        textColor="black"
                        size="small">
                        Jurisdictions
                        <City style={iconStyle} />
                      </Button>)}
                      <Button
                        aria-label="documents in this project"
                        color="white"
                        textColor="black"
                        component={Link}
                        disableRipple={true}
                        to={{ pathname: `/docs`, state: { projectDefined: true, project: this.props.project } }}
                        style={{ marginLeft: 10 }}>
                        Documents
                        <FileDocument style={iconStyle} />
                      </Button>
                      {!isCoder && (<Button
                        aria-label="Add and edit project coding scheme"
                        to={`/project/${project.id}/coding-scheme`}
                        component={Link}
                        color="white"
                        textColor="black"
                        style={{ marginLeft: 10 }}>
                        Coding Scheme
                        <FormatListBulleted style={iconStyle} />
                      </Button>)}
                      <Button
                        aria-label="Add and edit project protocol"
                        to={`/project/${project.id}/protocol`}
                        component={Link}
                        color="white"
                        textColor="black"
                        style={{ marginLeft: 10 }}>
                        Protocol
                        <ClipboardCheckOutline style={iconStyle} />
                      </Button>
                      <Button
                        aria-label="Export validated questions"
                        onClick={() => onExport(project)}
                        id={`export-validated-${project.id}`}
                        color="white"
                        textColor="black"
                        style={{ marginLeft: 10 }}>
                        Export
                        <FileExport style={{ fontSize: 18 }} />
                      </Button>
                    </FlexGrid>
                  </FlexGrid>
                  <FlexGrid style={{ flexBasis: '5%' }} />
                  <FlexGrid container style={{ paddingLeft: 20 }}>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Created Date:{' '}</span>
                      {createdDate}
                    </Typography>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Created By:{' '}</span>
                      {project.createdBy}</Typography>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Date Last Edited:{' '}</span>
                      {date}</Typography>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Last Edited By:{' '}</span>
                      {project.lastEditedBy}
                    </Typography>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Coordinator(s):{' '}</span>
                      <span>{this.props.users.filter((oneCoder) => {
                        return oneCoder.role !== 'Coder'
                      }).map((oneCoder) => {
                        return oneCoder.firstName + ' ' + oneCoder.lastName
                      }).join(', ')}</span>
                    </Typography>
                    <Typography variant="body2" style={{ paddingBottom: 10 }}>
                      <span style={listingStyle}>Coder(s):{' '}</span>
                      <span>{this.props.users.filter((oneCoder) => {
                        return oneCoder.role === 'Coder'
                      }).map((oneCoder) => {
                        return oneCoder.firstName + ' ' + oneCoder.lastName
                      }).join(', ')}</span>
                    </Typography>
                    <Typography variant="body2">
                      <span style={listingStyle}>Type:{' '}</span>
                      <span>{(this.props.project.type === 1) ? 'Legal Scan' : 'Policy Surveillance'}</span>
                    </Typography>
                    <FlexGrid />
                  </FlexGrid>
                  <FlexGrid />
                  <FlexGrid
                    container
                    type="column"
                    style={{ alignItems: 'flex-end', height: '45%', paddingBottom: 20 }}
                    justify="flex-end">
                    <FlexGrid
                      container
                      type="row"
                      justify="flex-end"
                      style={{ alignItems: 'center', width: '25%', alignSelf: 'flex-end' }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              {...generateKeyAndId('code')}
                              padding="checkbox"
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '50%',
                                maxWidth: '50%',
                                padding: '0 12px',
                                border: 'none'
                              }}>
                              <Button
                                raised={false}
                                value="Code"
                                listButton
                                aria-label="Code project"
                                component={Link}
                                to={{ pathname: `/project/${project.id}/code` }}
                                style={{ width: '100%', height: 50 }}
                              />
                            </TableCell>
                            {!isCoder &&
                            <TableCell
                              {...generateKeyAndId('validate')}
                              padding="checkbox"
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '50%',
                                maxWidth: '50%',
                                padding: '0 12px',
                                border: 'none'
                              }}>
                              <Button
                                raised={false}
                                value="Validate"
                                listButton
                                aria-label="Validate project"
                                component={Link}
                                to={{ pathname: `/project/${project.id}/validate` }}
                                style={{ width: '100%', height: 50 }}
                              />
                            </TableCell>}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </FlexGrid>
                  </FlexGrid>
                </FlexGrid>
              </FlexGrid>
            ) : (
              <Table
                style={{
                  borderCollapse: 'separate',
                  display: 'block',
                  tableLayout: 'fixed',
                  overflow: 'auto'
                }}>
                <colgroup>
                  <col style={{ width: '1%' }} />
                  <col style={{ width: '33%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '0%' }} />
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '5%' }} />
                </colgroup>
                <TableBody>
                  <TableRow
                    style={{
                      fontSize: 13,
                      color: '#757575',
                      fontWeight: 400,
                      paddingBottom: 10,
                      height: 25
                    }}>
                    <TableCell
                      {...generateKeyAndId('bookmarked')}
                      padding="checkbox"
                      style={{ paddingLeft: 24, paddingRight: 0, width: '1%', border: 'none' }}>
                      <IconButton
                        color={this.props.bookmarked ? '#fdc43b' : greyIcon}
                        onClick={() => actions.toggleBookmark(project)}
                        tooltipText="Bookmark project"
                        aria-label="Bookmark this project"
                        id={`bookmark-project-${project.id}`}>
                        {bookmarked ? 'bookmark' : 'bookmark_border'}
                      </IconButton>
                    </TableCell>
                    <TableCell
                      {...generateKeyAndId('name')}
                      // padding="checkbox"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        // width: '35%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <TextLink
                        aria-label="Edit project details"
                        to={{
                          pathname: `/project/edit/${project.id}`,
                          state: { projectDefined: { ...project }, modal: true }
                        }}>
                        {project.name}
                      </TextLink>
                    </TableCell>
                    <TableCell
                      // padding="checkbox"
                      {...generateKeyAndId('dateLastEdited')}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        // width: '15%',
                        // maxWidth: '15%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <span style={{ color: 'black' }}>Date Last Edited:{' '}</span>
                      <span>{date}</span>
                    </TableCell>
                    <TableCell
                      // padding="checkbox"
                      {...generateKeyAndId('lastEditedBy')}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        // width: '15%',
                        // maxWidth: '15%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <span style={{ color: 'black' }}>Last Edited By:{' '}</span>
                      {project.lastEditedBy}
                    </TableCell>
                    <TableCell
                      // padding="checkbox"
                      style={{
                        // width: '25%',
                        // maxWidth:'25%',
                        border: 'none'
                      }}
                    />
                    <TableCell
                      {...generateKeyAndId('code')}
                      // padding="checkbox"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        // width: '5%',
                        // maxWidth: '5%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <Button
                        raised={false}
                        value="Code"
                        listButton
                        aria-label="Code project"
                        component={Link}
                        to={{ pathname: `/project/${project.id}/code` }}
                      />
                    </TableCell>
                    {!isCoder &&
                    <TableCell
                      {...generateKeyAndId('validate')}
                      // padding="checkbox"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        // width: '5%',
                        // maxWidth: '5%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <Button
                        raised={false}
                        value="Validate"
                        listButton
                        aria-label="Validate project"
                        component={Link}
                        to={{ pathname: `/project/${project.id}/validate` }}
                      />
                    </TableCell>}
                  </TableRow>
                </TableBody>
              </Table>)
            }
          </ExpansionPanelSummary>
        </ExpansionPanel>
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
    expanded: ownProps.id === state.scenes.home.main.selectedProjectId,
    allUsers: state.data.user.byId
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(withStyles(styles)(ProjectPanel)))
