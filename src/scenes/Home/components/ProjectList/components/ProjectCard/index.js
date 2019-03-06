import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import Table from 'components/Table'
import Button from 'components/Button'
import Link from 'components/Link'
import TextLink from 'components/TextLink'
import IconButton from 'components/IconButton'
import TableCell from '@material-ui/core/TableCell'
import * as actions from 'scenes/Home/actions'
import moment from 'moment'
import { commonHelpers } from 'utils'
import {FlexGrid, Card} from 'components'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import ButtonBase from '@material-ui/core/ButtonBase'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

export class ProjectCard extends Component {

    static propTypes = {
      project: PropTypes.object,
      role: PropTypes.string,
      bookmarked: PropTypes.bool,
      actions: PropTypes.object,
      onExport: PropTypes.func,
      theme: PropTypes.object
    }

    constructor(props) {
      super(props)
      this.state = {
        cardExpanded: false,
        cardHeight: 40
      }
    }
    // const {project, role, bookmarked, actions, onExport, theme, classes, key} = props
    handleCardClick = () => {
      this.setState({
        cardExpanded : this.state.cardExpanded?false:true
      })
    }
    render() {
      const isCoder = this.props.role === 'Coder'
      const greyIcon = this.props.theme.palette.greyText
      const generateKeyAndId = commonHelpers.generateUniqueProps(this.props.project.id)

      //const date = moment.parseZone(project.dateLastEdited).local().format('M/D/YYYY, h:mm A')
      const date = moment.utc(this.props.project.dateLastEdited).local().format('M/D/YYYY')
      const styles = theme => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper
        },
        gridList: {
          width: 100,
          height: 200
        }
      })
      let cardHeight = 40
      const coderData = [
        {
          'id': 3,
          'firstName': 'Greg',
          'lastName': 'Ledbetter',
          'email': 'jtq6@cdc.gov',
          'avatar': 'data:image/jpeg;base64,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',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 4,
          'firstName': 'Jason',
          'lastName': 'James',
          'email': 'lgy2@cdc.gov',
          'avatar': 'data:image/jpeg;base64,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',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 5,
          'firstName': 'Kristin',
          'lastName': 'Muterspaw',
          'email': 'nlf5@cdc.gov',
          'avatar': 'data:image/jpeg;base64,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',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 6,
          'firstName': 'Mary',
          'lastName': 'Peck',
          'email': 'dhi4@cdc.gov',
          'avatar': '',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 8,
          'firstName': 'Sanjith',
          'lastName': 'David',
          'email': 'xjy5@cdc.gov',
          'avatar': '',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 9,
          'firstName': 'Tara',
          'lastName': 'Ramanathan',
          'email': 'irt2@cdc.gov',
          'avatar': '',
          'role': 'Admin',
          'isActive': true
        },
        {
          'id': 12,
          'firstName': 'Tester',
          'lastName': '1',
          'email': 'iiutester1@test.gov',
          'avatar': 'data:image/jpeg;base64,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',
          'role': 'Admin',
          'isActive': true
        }
      ]
      const listStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: 250,
        maxWidth: 250,
        padding: '0 12px'
      }
      const handleClickAway = e => {
        // if (this.expanded) {
        //   if (e.path[1] !== this.buttonRef) {
        //     collapseCard(e)
        //   }
        // }
      }

      const collapseCard = (e) => {
        cardHeight = 40
      }

      return (
        <ClickAwayListener onClickAway={handleClickAway}>
          {this.state.cardExpanded ? (
            <Card style={{paddingLeft: 5, paddingBottom: 20, boxShadow: 'none', height: this.state.cardHeight}}>
              <ButtonBase disableRipple={true} onClick={this.handleCardClick}>
                <CardContent>
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
                            onClick={() => actions.toggleBookmark(this.props.project)}
                            tooltipText="Bookmark project"
                            aria-label="Bookmark this project"
                            id={`bookmark-project-${this.props.project.id}`}>
                            {this.props.bookmarked ? 'bookmark' : 'bookmark_border'}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          {...generateKeyAndId('name')}
                          padding="checkbox"
                          style={listStyle}>
                          <TextLink
                            aria-label="Edit project details"
                            to={{
                              pathname: `/project/edit/${this.props.project.id}`,
                              state: {projectDefined: {...this.props.project}, modal: true}
                            }}>
                            {this.props.project.name}
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
                            style={{color: 'black'}}>Last Edited By: </span>{this.props.project.lastEditedBy}
                        </TableCell>
                        <TableCell padding="checkbox" style={{width: 350}} />
                        <TableCell {...generateKeyAndId('code')} padding="checkbox">
                          <Button
                            raised={false}
                            value="Code"
                            listButton
                            aria-label="Code project"
                            component={Link}
                            to={{pathname: `/project/${this.props.project.id}/code`}}
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
                              to={{pathname: `/project/${this.props.project.id}/validate`}}
                            />
                          </TableCell>}
                        {!isCoder &&
                          <TableCell padding="checkbox" {...generateKeyAndId('export')}>
                            <IconButton
                              color={greyIcon}
                              tooltipText="Export validated questions"
                              placement="top-end"
                              aria-label="Export validated questions"
                              onClick={() => this.props.actions.onExport(this.props.project)}
                              id={`export-validated-${this.props.project.id}`}>
                                                    file_download
                            </IconButton>
                          </TableCell>}
                      </TableRow>
                    </TableBody>
                  </Table>
                  {this.props.project.id !== 0 ? '' : <GridList cols={2}>
                    {coderData.map(oneCoder => (
                      <GridListTile key={oneCoder.id} cols={oneCoder.cols || 1}>
                        <img src={oneCoder.avatar} alt={oneCoder.id} />
                      </GridListTile>
                    ))}
                  </GridList>}
                </CardContent>
              </ButtonBase>
            </Card>)
            : (<Card style={{paddingLeft: 5, paddingBottom: 20, boxShadow: 'none', height: 100}}>
              <ButtonBase disableRipple={true} onClick={this.handleCardClick}>
                <CardContent>
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
                            onClick={() => actions.toggleBookmark(this.props.project)}
                            tooltipText="Bookmark project"
                            aria-label="Bookmark this project"
                            id={`bookmark-project-${this.props.project.id}`}>
                            {this.props.bookmarked ? 'bookmark' : 'bookmark_border'}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          {...generateKeyAndId('name')}
                          padding="checkbox"
                          style={listStyle}>
                          <TextLink
                            aria-label="Edit project details"
                            to={{
                              pathname: `/project/edit/${this.props.project.id}`,
                              state: {projectDefined: {...this.props.project}, modal: true}
                            }}>
                            {this.props.project.name}
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
                            style={{color: 'black'}}>Last Edited By: </span>{this.props.project.lastEditedBy}
                        </TableCell>
                        <TableCell padding="checkbox" style={{width: 350}} />
                        <TableCell {...generateKeyAndId('code')} padding="checkbox">
                          <Button
                            raised={false}
                            value="Code"
                            listButton
                            aria-label="Code project"
                            component={Link}
                            to={{pathname: `/project/${this.props.project.id}/code`}}
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
                            to={{pathname: `/project/${this.props.project.id}/validate`}}
                          />
                        </TableCell>}
                        {!isCoder &&
                        <TableCell padding="checkbox" {...generateKeyAndId('export')}>
                          <IconButton
                            color={greyIcon}
                            tooltipText="Export validated questions"
                            placement="top-end"
                            aria-label="Export validated questions"
                            onClick={() => this.props.actions.onExport(this.props.project)}
                            id={`export-validated-${this.props.project.id}`}>
                                                file_download
                          </IconButton>
                        </TableCell>}
                      </TableRow>
                    </TableBody>
                  </Table>
                  {this.props.project.id !== 0 ? '' : <GridList cols={2}>
                    {coderData.map(oneCoder => (
                      <GridListTile key={oneCoder.id} cols={oneCoder.cols || 1}>
                        <img src={oneCoder.avatar} alt={oneCoder.id} />
                      </GridListTile>
                    ))}
                  </GridList>}
                </CardContent>
              </ButtonBase>
            </Card>)
            }
        </ClickAwayListener>
      )
    }
}
const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.id],
  role: state.data.user.currentUser.role,
  bookmarked: state.scenes.home.main.bookmarkList.includes(ownProps.id)
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(ProjectCard))