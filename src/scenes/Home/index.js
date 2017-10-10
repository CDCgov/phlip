import React from 'react'
import { connect } from 'react-redux'

const Home = () => {
  return (
    <div> This is the home scene </div>
  )
}

function mapStateToProps(state, ownProps) { return {} }

function mapDispatchToProps(dispatch) { return {} }

export default connect(mapStateToProps, mapDispatchToProps)(Home)