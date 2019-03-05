import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme,withStyles} from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import Table from 'components/Table'
import TableBody from '@material-ui/core/TableBody'
import Button from 'components/Button'
import Link from 'components/Link'
import TextLink from 'components/TextLink'
import IconButton from 'components/IconButton'
import TableCell from '@material-ui/core/TableCell'
import * as actions from 'scenes/Home/actions'
import moment from 'moment'
import { commonHelpers } from 'utils'
// import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
//import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Typography from '@material-ui/core/Typography'
import FlexGrid from 'components/FlexGrid'
import { FileDocument, City, FormatListBulleted, ClipboardCheckOutline, FileExport } from 'mdi-material-ui'
import { getInitials } from 'utils/normalize'
import Avatar from 'components/Avatar'

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
  }
})

class ProjectPanel extends Component {
    static propTypes = {
      project : PropTypes.object,
      actions: PropTypes.object,
      role : PropTypes.string,
      theme : PropTypes.object,
      classes: PropTypes.object.isRequired,
      expanded: PropTypes.number,
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
      } else {
        this.props.actions.resetOpenProject()
      }
    }

    render() {
      const { project, role, bookmarked, actions, onExport, theme} = this.props
      const isCoder = role === 'Coder'
      const greyIcon = theme.palette.greyText
      const iconStyle = { fontSize: 18, paddingLeft:5 }
      const listingStyle = { fontSize: 14, fontWeight:500, color:'#757575'}
      const generateKeyAndId = commonHelpers.generateUniqueProps(project.id)

      //const date = moment.parseZone(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')
      const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
      let userData = []
      let avatarCols = 1
      let avatarRows = 1
      let cellHeight = 130
      userData = [...this.props.users]
      if (this.props.users.length >= 7) {
        avatarCols = 3
        avatarRows = 3
        cellHeight = 98
        // for(let i=0;i<9-this.props.users.length;i++){
        //
        // }
      } else if (this.props.users.length >= 5) {
        avatarCols = 3
        avatarRows = 3
        cellHeight = 95
        for(let i=0;i<(9-this.props.users.length);i++){
          const blankAvatar = {id:Date.now()+i}
          userData.push(blankAvatar)
        }

      } else if (this.props.users.length >= 2) {
        avatarCols = 2
        avatarRows = 2
        cellHeight = 150
        for(let i=0;i<(4-this.props.users.length);i++){
          const blankAvatar = {id:Date.now()+i}
          userData.push(blankAvatar)
        }
      } else if (this.props.users.length === 1) {
        avatarCols = 1
        //avatarRows = 1
        cellHeight = 290
      }

      const expanded = this.props.expanded === project.id
      return (
      //<div className={classes.root}>*/}
        <ExpansionPanel expanded={expanded} onChange={this.handleChange(project.id)} >
          <ExpansionPanelSummary>
            {expanded?( <FlexGrid container type='row' justify='space-between' style={{width:'100%'}}>
              {this.props.users.length !== 0?(
                <FlexGrid container type='column' style={{maxWidth: '25%'}}>
                  <GridList style={{width: 300, height: 304}} cellHeight={cellHeight} cols={avatarCols} rows={avatarRows}>
                    {userData.map(oneCoder => (
                      <GridListTile key={oneCoder.id}>
                        {/*<Avatar*/}
                        {/*cardAvatar*/}
                        {/*style={{ marginRight: 10 }}*/}
                        {/*initials={getInitials(oneCoder.firstName, oneCoder.lastName)}*/}
                        {/*userName={`${oneCoder.firstName} ${oneCoder.lastName}`}*/}
                        {/*avatar={oneCoder.avatar}*/}
                        {/*/>*/}
                        {oneCoder.avatar !== undefined?(oneCoder.avatar === ''?(
                          <FlexGrid
                            container
                            type='row'
                            justify='center'
                            align='center'
                            title={`${oneCoder.firstName} ${oneCoder.lastName}`}
                            style={{backgroundColor: theme.palette.secondary.main, height:'100%'}} >
                            <Typography style={{fontWeight:500, color:'white'}} >
                              {getInitials(oneCoder.firstName, oneCoder.lastName)}
                            </Typography>
                          </FlexGrid>
                        ):
                          (<img
                            src={oneCoder.avatar}
                            title={`${oneCoder.firstName} ${oneCoder.lastName}`}
                          />)):(
                            <div style={{backgroundColor:'#f5f5f5', height:'100%'}} />
                        )}
                        {/*<GridListTileBar*/}
                        {/*style={{height: 15}}*/}
                        {/*title={oneCoder.firstName + ' ' + oneCoder.lastName}*/}
                        {/*/>*/}
                      </GridListTile>
                    ))}
                  </GridList>
                </FlexGrid>
              ):(<FlexGrid container type='column' style={{maxWidth: '25%'}} />)}
              <FlexGrid container type="column" style={{ flexBasis: '79%'}}>
                <FlexGrid container type='row' style={{backgroundColor:'#f5f5f5', height:70, alignItems:'center'}} >
                  <FlexGrid container type='row' flex justify='flex-start' style={{fontSize:20, paddingLeft:20}}>
                    <IconButton
                      color={this.props.bookmarked ? '#fdc43b' : greyIcon}
                      onClick={() => actions.toggleBookmark(project)}
                      tooltipText="Bookmark project"
                      aria-label="Bookmark this project"
                      id={`bookmark-project-${project.id}`}>
                      {bookmarked ? 'bookmark' : 'bookmark_border'}
                    </IconButton>
                    <FlexGrid padding="checkbox" style={{width:20}} />
                    <TextLink
                      aria-label="Edit project details"
                      to={{
                        pathname: `/project/edit/${project.id}`,
                        state: {projectDefined: {...project}, modal: true}
                      }}>
                      {project.name}
                    </TextLink>
                  </FlexGrid>
                  <FlexGrid container type='row' flex justify='flex-end' align='center' style={{height:40, paddingRight:10}} >
                    {!isCoder && (<Button
                      id={`${project.id}-edit-jurisdictions`}
                      component={Link}
                      to={{ pathname: `/project/${project.id}/jurisdictions`, state: { modal: true } }}
                      disableRipple={true}
                      aria-label="Add and edit project jurisdictions"
                      color='white'
                      textColor='black'
                      size='small'>
                                    Jurisdictions
                      <City style={iconStyle} />
                    </Button>)}
                    <Button
                      aria-label="documents in this project"
                      color='white'
                      textColor='black'
                      style={{marginLeft:10}}>
                                    Documents
                      <FileDocument style={iconStyle} />
                    </Button>
                    {!isCoder && (<Button
                      aria-label="Add and edit project coding scheme"
                      to={`/project/${project.id}/coding-scheme`}
                      component={Link}
                      color='white'
                      textColor='black'
                      style={{marginLeft:10}}>
                                    Coding Scheme
                      <FormatListBulleted style={iconStyle} />
                    </Button>)}
                    <Button
                      aria-label="Add and edit project protocol"
                      to={`/project/${project.id}/protocol`}
                      component={Link}
                      color='white'
                      textColor='black'
                      style={{marginLeft:10}}>
                                    Protocol
                      <ClipboardCheckOutline style={iconStyle} />
                    </Button>
                    <Button
                      aria-label="Export validated questions"
                      onClick={() => onExport(project)}
                      id={`export-validated-${project.id}`}
                      color='white'
                      textColor='black'
                      style={{marginLeft:10}}>
                                    Export
                      <FileExport style={{ fontSize: 18 }} />
                    </Button>
                  </FlexGrid>
                </FlexGrid>
                <FlexGrid style={{flexBasis:'2%'}} />
                <FlexGrid container style={{paddingLeft:20}}>
                  <Typography variant="body2">
                    <span style={listingStyle}>Date Last Edited: </span>{date}</Typography>
                  <Typography variant="body2">
                    <span style={listingStyle}>Last Edited By: </span>{project.lastEditedBy}
                  </Typography>
                  <Typography variant="body2">
                    <span style={listingStyle}>Coordinator(s): </span><span>{this.props.users.filter((oneCoder)=> {
                      return oneCoder.role!== 'Coder'
                    }).map((oneCoder) => {
                      return oneCoder.firstName+ ' '+oneCoder.lastName
                    }).join(', ')}</span>
                  </Typography >
                  <Typography variant="body2">
                    <span style={listingStyle}>Coder(s): </span><span>{this.props.users.filter((oneCoder)=> {
                      return oneCoder.role === 'Coder'
                    }).map((oneCoder) => {
                      return oneCoder.firstName+ ' '+oneCoder.lastName
                    }).join(', ')}</span>
                  </Typography>
                  <FlexGrid />
                </FlexGrid>
                <FlexGrid />
                <FlexGrid container type='row' justify='flex-end' style={{alignItems:'center', width:'25%', alignSelf:'flex-end'}}>
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
                            to={{pathname: `/project/${project.id}/code`}}
                            style={{width:'100%'}}
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
                            to={{pathname: `/project/${project.id}/validate`}}
                            style={{width:'100%'}}
                          />
                        </TableCell>}
                      </TableRow>
                    </TableBody>
                  </Table>
                </FlexGrid>
              </FlexGrid>
            </FlexGrid>):
              (<Table
                style={{
                  borderCollapse: 'separate',
                  display: 'block',
                  tableLayout: 'auto',
                  overflow: 'auto'
                }}>
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
                      style={{paddingLeft: 24, paddingRight: 0, width: '1%', border: 'none'}}>
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
                      padding="checkbox"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '35%',
                        maxWidth: '35%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <TextLink
                        aria-label="Edit project details"
                        to={{
                          pathname: `/project/edit/${project.id}`,
                          state: {projectDefined: {...project}, modal: true}
                        }}>
                        {project.name}
                      </TextLink>
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      {...generateKeyAndId('dateLastEdited')}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '15%',
                        maxWidth: '15%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <span
                        style={{color: 'black'}}>Date Last Edited:</span><span> {date}</span>
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      {...generateKeyAndId('lastEditedBy')}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '15%',
                        maxWidth: '15%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <span
                        style={{color: 'black'}}>Last Edited By: </span>{project.lastEditedBy}
                    </TableCell>
                    <TableCell padding="checkbox" style={{width: '25%', border: 'none'}} />
                    <TableCell
                      {...generateKeyAndId('code')}
                      padding="checkbox"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '5%',
                        maxWidth: '5%',
                        padding: '0 12px',
                        border: 'none'
                      }}>
                      <Button
                        raised={false}
                        value="Code"
                        listButton
                        aria-label="Code project"
                        component={Link}
                        to={{pathname: `/project/${project.id}/code`}}
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
                          width: '5%',
                          maxWidth: '5%',
                          padding: '0 12px',
                          border: 'none'
                        }}>
                        <Button
                          raised={false}
                          value="Validate"
                          listButton
                          aria-label="Validate project"
                          component={Link}
                          to={{pathname: `/project/${project.id}/validate`}}
                        />
                      </TableCell>}
                    {/*{!isCoder &&*/}
                    {/*<TableCell padding="checkbox" {...generateKeyAndId('export')} style={listStyle}>*/}
                    {/*<IconButton*/}
                    {/*color={greyIcon}*/}
                    {/*tooltipText="Export validated questions"*/}
                    {/*placement="top-end"*/}
                    {/*aria-label="Export validated questions"*/}
                    {/*onClick={() => actions.onExport(project)}*/}
                    {/*id={`export-validated-${project.id}`}>*/}
                    {/*file_download*/}
                    {/*</IconButton>*/}
                    {/*</TableCell>}*/}
                  </TableRow>
                </TableBody>
              </Table>)
              }
          </ExpansionPanelSummary>
          {/*<ExpansionPanelDetails />*/}
        </ExpansionPanel>
      // </div>
      )
    }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.id],
  role: state.data.user.currentUser.role,
  bookmarked: state.scenes.home.main.bookmarkList.includes(ownProps.id),
  users: state.scenes.home.main.projectUsers.curProjectUsers || [],
  expanded: state.scenes.home.main.projectUsers.currentProject
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(withStyles(styles)(ProjectPanel)))
