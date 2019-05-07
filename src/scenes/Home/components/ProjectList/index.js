import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import { FlexGrid, Table, TablePagination } from 'components'
import ProjectPanel from './components/ProjectPanel'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const isRouteOk = history => {
  return history.action !== 'PUSH'
    ? true
    : matchPath(history.location.pathname, { path: '/project/edit/:id' }) === null &&
    matchPath(history.location.pathname, { path: '/project/add' }) === null
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
    expanded: 0
  }
  
  checkTargetPath = path => {
    let valid = true
    path.forEach(node => {
      if (['projectSort-container', 'menu-projectSort'].includes(node.id)) {
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
          : expand ? id : 0
      })
    }
  }
  
  /**
   * Handles closing a project is the user clicks away
   * @param event
   */
  handleClickAway = event => {
    if (this.props.location.pathname === '/home' && isRouteOk(this.props.history)) {
      const parent = event.target.offsetParent ? event.target.offsetParent : event.target.parentNode
      const expand = (this.checkExpand(event.target) && this.checkExpand(parent))
        && this.checkTargetPath(event.path)
      
      this.setState({
        expanded: expand ? 0 : this.state.expanded
      })
    }
  }
  
  render() {
    const {
      projectIds, user, page, rowsPerPage, projectCount, handlePageChange, handleRowsChange, handleExport,
      getProjectUsers
    } = this.props
    
    const { expanded } = this.state
    
    return (
      <FlexGrid style={{ overflow: 'auto' }}>
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
        <Table>
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
        </Table>
      </FlexGrid>
    )
  }
}

export default withRouter(ProjectList)
