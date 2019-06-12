import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import { FlexGrid, Table, TablePagination } from 'components'
import ProjectPanel from './components/ProjectPanel'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const modalPaths = [
  '/project/edit/:id',
  '/project/add',
  '/user/:id/avatar',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

const isRouteOk = history => {
  return history.action !== 'PUSH'
    ? true
    : modalPaths.every(path => matchPath(history.location.pathname, { path }) === null)
}

export class ProjectList extends Component {
  static propTypes = {
    projectIds: PropTypes.array,
    user: PropTypes.object,
    page: PropTypes.number,
    rowsPerPage: PropTypes.string,
    projectCount: PropTypes.number,
    sortBy: PropTypes.string,
    direction: PropTypes.string,
    sortBookmarked: PropTypes.bool,
    searchValue: PropTypes.string,
    handlePageChange: PropTypes.func,
    handleRowsChange: PropTypes.func,
    handleRequestSort: PropTypes.func,
    handleSortBookmarked: PropTypes.func,
    handleSearchValueChange: PropTypes.func,
    handleExport: PropTypes.func,
    getProjectUsers: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
  }
  
  state = {
    expanded: 0,
    mouse: {
      x: 0,
      y: 0
    }
  }
  
  /**
   * Checks the target node for a click away event
   * @param path
   * @returns {boolean}
   */
  checkTargetPath = path => {
    let valid = true
    path.forEach(node => {
      if (['projectSort-container', 'menu-projectSort', 'avatar-user-menu'].includes(node.id)) {
        valid = false
      }
    })
    return valid
  }
  
  /**
   * Checks whether or not the project should expand based on what was clicked
   * @param target
   * @returns {boolean}
   */
  checkExpand = target => {
    const stopOpenEls = ['A', 'BUTTON', 'button', 'a']
    const regex = /([Bb]utton)|(icons?)|([sS]elect)|([iI]nput)/g
    return !stopOpenEls.includes(target.tagName)
      && (target.tagName !== 'svg' ? target.className.search(regex) === -1 : true)
      && target.id !== 'avatar-menu-button'
      && target.tagName !== 'INPUT'
  }
  
  /**
   * Sets a project to expanded or closed based on criteria
   * @param id
   * @param event
   */
  handleExpandProject = (id, event) => {
    if (this.props.location.pathname === '/home' && isRouteOk(this.props.history)) {
      const expand = this.checkExpand(event.target) &&
        this.checkExpand(event.target.offsetParent ? event.target.offsetParent : event.target.parentNode)
      
      this.setState({
        expanded: this.state.expanded === id
          ? expand ? 0 : id
          : expand ? id : 0,
        mouse: {
          x: 0,
          y: 0
        }
      })
    }
  }
  
  /**
   * Handles closing a project is the user clicks away
   * @param event
   */
  handleClickAway = event => {
    let expanded = this.state.expanded
    let check = true
    
    if (this.state.mouse.x !== 0 || this.state.mouse.y !== 0) {
      if (event.clientX !== this.state.mouse.x && event.clientY !== this.state.mouse.y) {
        check = false
      }
    }
    
    if (check) {
      if (event.offsetX <= event.target.clientWidth && event.offsetY <= event.target.clientHeight) {
        if (this.props.location.pathname === '/home' && isRouteOk(this.props.history)) {
          const parent = event.target.offsetParent ? event.target.offsetParent : event.target.parentNode
          const expand = (this.checkExpand(event.target) && this.checkExpand(parent))
            && this.checkTargetPath(event.path)
          
          expanded = expand ? 0 : this.state.expanded
        }
      }
    }
    
    this.setState({
      expanded,
      mouse: {
        x: 0,
        y: 0
      }
    })
  }
  
  /**
   * Sets the coordinates of the mouse when clicking down to check the position when mouse up for whether the project
   * needs to be closed or hided
   * @param e
   */
  onMouseDown = e => {
    this.setState({
      mouse: {
        x: e.clientX,
        y: e.clientY
      }
    })
  }
  
  render() {
    const {
      projectIds, user, page, rowsPerPage, projectCount, handlePageChange, handleRowsChange, handleExport,
      getProjectUsers
    } = this.props
    
    const { expanded } = this.state
    
    return (
      <FlexGrid style={{ overflow: 'auto' }} onMouseDown={this.onMouseDown}>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div style={{ padding: 3 }}>
            {projectIds.map((id, i) => (
              <ProjectPanel
                key={id}
                index={i}
                length={projectIds.length}
                id={id}
                onExport={handleExport}
                role={user.role}
                getProjectUsers={getProjectUsers}
                handleExpandProject={this.handleExpandProject}
                expanded={expanded === id}
              />
            ))}
          </div>
        </ClickAwayListener>
        {projectCount > 0 && <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={projectCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, page) => handlePageChange(page)}
                onChangeRowsPerPage={(event) => handleRowsChange(event.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>}
      </FlexGrid>
    )
  }
}

export default withRouter(ProjectList)
