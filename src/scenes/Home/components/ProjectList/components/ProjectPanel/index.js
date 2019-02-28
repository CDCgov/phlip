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
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import FlexGrid from 'components/FlexGrid'

const styles = theme => ({
  root: {
    width: '98%'
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
      classes: PropTypes.object.isRequired
    }
    constructor(props) {
      super(props)
    }
    state = {
      cardExpanded: null
    }
    handleChange = panel => (event, expanded) => {
      console.log('expand ',expanded, 'panel ',panel)
      // this.setState({ cardExpanded:panel }, function () {
      //   console.log(this.state.cardExpanded)
      // })
      if (expanded) {
        this.setState({cardExpanded: panel})
        console.log(this.state)
      } else {
        this.setState({cardExpanded: false})
      }

    }

    render() {
      const { project, role, bookmarked, actions, onExport, theme, classes} = this.props
      const isCoder = role === 'Coder'
      const greyIcon = theme.palette.greyText
      const generateKeyAndId = commonHelpers.generateUniqueProps(project.id)

      //const date = moment.parseZone(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')
      const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')

      const listStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: 250,
        maxWidth: 250,
        padding: '0 12px'
      }
      return (
      //<div className={classes.root}>*/}
        <ExpansionPanel expanded={this.state.cardExpanded ===`panel-${project.id}`} onChange={this.handleChange(`panel-${project.id}`)} >
          <ExpansionPanelSummary>
            <Table>
              <TableBody>
                <TableRow
                  style={{
                    fontSize: 13,
                    color: '#757575',
                    fontWeight: 400,
                    paddingBottom: 30
                  }}>
                  <TableCell
                    {...generateKeyAndId('bookmarked')}
                    style={{paddingLeft: 24, paddingRight: 0, width: '1%'}}>
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
                    style={listStyle}>
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
                    style={{width: 250}}>
                    <span
                      style={{color: 'black'}}>Date Last Edited:</span><span> {date}</span>
                  </TableCell>
                  <TableCell
                    padding="checkbox"
                    {...generateKeyAndId('lastEditedBy')}
                    style={{width: 250}}>
                    <span
                      style={{color: 'black'}}>Last Edited By: </span>{project.lastEditedBy}
                  </TableCell>
                  <TableCell padding="checkbox" style={{width: 350}} />
                  <TableCell {...generateKeyAndId('code')} padding="checkbox">
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
                  <TableCell {...generateKeyAndId('validate')} padding="checkbox">
                    <Button
                      raised={false}
                      value="Validate"
                      listButton
                      aria-label="Validate project"
                      component={Link}
                      to={{pathname: `/project/${project.id}/validate`}}
                    />
                  </TableCell>}
                  {!isCoder &&
                  <TableCell padding="checkbox" {...generateKeyAndId('export')}>
                    <IconButton
                      color={greyIcon}
                      tooltipText="Export validated questions"
                      placement="top-end"
                      aria-label="Export validated questions"
                      onClick={() => actions.onExport(project)}
                      id={`export-validated-${project.id}`}>
                                  file_download
                    </IconButton>
                  </TableCell>}
                </TableRow>
              </TableBody>
            </Table>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails >
            <FlexGrid type='row' />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      // </div>
      )
    }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.id],
  role: state.data.user.currentUser.role,
  bookmarked: state.scenes.home.main.bookmarkList.includes(ownProps.id)
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(withStyles(styles)(ProjectPanel)))
