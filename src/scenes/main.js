import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import IdleTimer from 'react-idle-timer'
import { bindActionCreators } from 'redux'
import Home from './Home'
import DocumentManagement from './DocumentManagement'
import AppHeader from 'components/AppHeader'
import FlexGrid from 'components/FlexGrid'
import Admin from './Admin'
import CodingScheme from './CodingScheme'
import Protocol from './Protocol'
import AddEditProject from './Home/scenes/AddEditProject'
import AddEditJurisdictions from './Home/scenes/AddEditJurisdictions'
import JurisdictionForm from './Home/scenes/AddEditJurisdictions/components/JurisdictionForm'
import ApiErrorAlert from 'components/ApiErrorAlert'
import DocumentView from './DocumentView'
import actions from './actions'
import CodingValidation from './CodingValidation'

/** Paths that aren't accessible by users with 'Coder' role */
const nonCoderPaths = [
  '/project/add',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

const modalPath = '/project/edit/:id'

/**
 * Main scenes component for views that require a login (i.e. everything but the Login view). All of the react-router
 * routes are set here.
 *
 * @param match
 * @param location
 * @param role
 * @param otherProps
 * @param dispatch
 * @param isRefreshing
 * @returns {*}
 * @constructor
 */
class Main extends Component {
  static propTypes = {
    history: PropTypes.object,
    pdfFile: PropTypes.any,
    actions: PropTypes.object,
    location: PropTypes.object,
    role: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    user: PropTypes.object,
    pdfError: PropTypes.any
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.helpPdfRef = React.createRef()
    
    this.state = {
      menuOpen: false,
      menuTabs: [
        {
          label: 'Project List',
          active: !props.history.location.pathname.startsWith('/docs'),
          location: '/home',
          icon: 'dvr'
        },
        {
          label: 'Document Management',
          active: props.history.location.pathname.startsWith('/docs'),
          location: '/docs',
          icon: 'description'
        }
      ]
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.pdfFile === null && this.props.pdfFile !== null) {
      this.openHelpPdf(this.props.pdfFile)
    }
    
    const prev = prevProps.location.pathname.split('/')[1]
    const current = this.props.location.pathname.split('/')[1]
    
    const tabs = [...this.state.menuTabs]
    
    if (prev !== current) {
      if (current === 'docs') {
        tabs[1].active = true
        tabs[0].active = false
      } else {
        tabs[0].active = true
        tabs[1].active = false
      }
      
      this.setState({
        menuTabs: tabs
      })
    }
  }
  
  /**
   * Checks if the route path is a modal view.
   *
   * @param pathname
   * @param role
   * @returns {Object}
   */
  checkForModalMatch = (pathname, role) => {
    let location = pathname
    if (matchPath(pathname, { path: modalPath }) !== null) {
      location = '/home'
    }
    
    nonCoderPaths.forEach(path => {
      const match = matchPath(pathname, { path })
      if (match !== null) location = '/home'
    })
    
    return location
  }
  
  /**
   * Handles when the top level menu changes
   * @param index
   */
  handleTabChange = index => {
    const newLocation = this.state.menuTabs[index].location
    this.props.history.push(newLocation)
    this.setState({
      menuTabs: this.state.menuTabs.map((tab, i) => ({
        ...tab,
        active: index === i
      }))
    })
  }
  
  /**
   * Logs out a user
   */
  handleLogoutUser = () => {
    this.props.actions.logoutUser()
    this.props.history.push('/login')
  }
  
  /**
   * Handles when the user click 'Help Guide' in the avatar menu
   * @public
   */
  handleDownloadPdf = () => {
    this.handleToggleMenu()
    this.props.actions.downloadPdfRequest()
  }
  
  /**
   * Creates an object url from the pdfFile and attaches the hidden `<a>` element to it
   * @public
   * @param pdfFile
   */
  openHelpPdf = pdfFile => {
    const url = URL.createObjectURL(pdfFile)
    this.helpPdfRef.current.href = url
    this.helpPdfRef.current.download = 'PHLIP-Help-Guide.pdf'
    this.helpPdfRef.current.click()
    this.props.actions.clearPdfFile()
  }
  
  /**
   * Closes the error alert when the user clicks 'dismiss'
   * @public
   */
  closeDownloadErrorAlert = () => {
    this.props.actions.resetDownloadError()
  }
  
  /**
   * Opens user menu in header
   */
  handleToggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }
  
  /**
   * Navigates to the User Management page (clicked from the user menu)
   */
  handleOpenAdminPage = () => {
    const tabs = [...this.state.menuTabs]
    
    if (this.state.menuTabs[1].active) {
      tabs[1].active = false
      tabs[0].active = true
    }
    
    this.setState({
      menuOpen: false,
      menuTabs: tabs
    })
    
    this.props.history.push('/admin')
  }
  
  logoutUserOnIdle = () => {
    this.props.actions.logoutUser(true)
  }
  
  render() {
    const { location, role, actions, isLoggedIn, isRefreshing, user, pdfError } = this.props
    const { menuTabs, menuOpen } = this.state
    
    // This is for jurisdictions / add/edit project modals. We want the modals to be displayed on top of the home
    // screen, so we check if it's one of those routes and if it is set the location to /home
    const currentLocation = { ...location, pathname: this.checkForModalMatch(location.pathname, role) }
    if (!isRefreshing && isLoggedIn) actions.startRefreshJwt()
    const containerType = location.pathname.endsWith('/code') || location.pathname.endsWith('/validate')
      ? 'row'
      : 'column'
    
    return (
      <FlexGrid container type="column" flex style={{ overflow: 'hidden' }}>
        <IdleTimer onIdle={this.logoutUserOnIdle} timeout={900000} />
        <AppHeader
          user={user}
          tabs={menuTabs}
          open={menuOpen}
          onLogoutUser={this.handleLogoutUser}
          onToggleMenu={this.handleToggleMenu}
          onDownloadPdf={this.handleDownloadPdf}
          onTabChange={this.handleTabChange}
          onOpenAdminPage={this.handleOpenAdminPage}
        />
        <FlexGrid container type={containerType} flex style={{ backgroundColor: '#f5f5f5', height: '100%' }}>
          <Switch location={currentLocation}>
            <Route path="/docs/:id/view" component={DocumentView} />
            <Route path="/docs" component={DocumentManagement} />
            <Route path="/project/:id/(code|validate)" component={CodingValidation} />
            <Route path="/admin" component={Admin} />
            <Route strict path="/project/:id/coding-scheme" component={CodingScheme} />
            <Route strict path="/project/:id/protocol" component={Protocol} />
            <Route path="/home" component={Home} />
            <Route path="/" exact render={() => <Redirect to={{ pathname: '/home' }} />} />
          </Switch>
          <Route path="/project/edit/:id" component={AddEditProject} />
          <Route path="/project/add" component={AddEditProject} />
          <Route path="/project/:id/jurisdictions" component={AddEditJurisdictions} />
          <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
          <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
          <ApiErrorAlert content={pdfError} open={pdfError !== ''} onCloseAlert={this.closeDownloadErrorAlert} />
          <a style={{ display: 'none' }} ref={this.helpPdfRef} />
        </FlexGrid>
      </FlexGrid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.data.user.currentUser,
  pdfError: state.scenes.main.pdfError,
  pdfFile: state.scenes.main.pdfFile,
  isRefreshing: state.scenes.main.isRefreshing
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Main)
