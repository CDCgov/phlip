import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import { default as MuiTabs, Tab } from 'material-ui/Tabs'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
})

const Tabs = ({ tabs, selectedTab, onChangeTab, children, classes }) => {
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: '#e8f9f8' }} elevation={0}>
        <MuiTabs value={selectedTab} onChange={onChangeTab} indicatorColor="accent" textColor="accent" scrollable scrollButtons="on">
          {tabs.map(tab => (
            <Tab key={tab.id} label={tab.text} />
          ))}
        </MuiTabs>
      </AppBar>
      {children}
    </div>
  )
}

Tabs.propTypes = {
}

export default withStyles(styles)(Tabs)