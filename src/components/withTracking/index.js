import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

export const withTracking = (WrappedComponent, pageName) => {
  class AdobeAnalyticsTracking extends Component {
    constructor(props, context) {
      super(props, context)
    }

    componentDidMount() {
      this.updateSiteCatalystVariables()
      this.pageName = pageName === 'Project Form'
        ? this.props.location.state.projectDefined === null ? 'Create New Project' : 'Project Details'
        : pageName
    }

    updateSiteCatalystVariables = () => {
      s.pageName = this.pageName
      s.channel = 'Public Health Law'

      //* Center Name *
      siteCatalyst.setLevel1('OSTLTS')
      //* Division, Office or Program Name *
      siteCatalyst.setLevel2('Office of the Director')
      //* CDC Topic Name *
      siteCatalyst.setLevel3('Public Health Law')
      siteCatalyst.setLevel4('Public Health Law Investigation Platform')

      //siteCatalyst.setAzEntry('ENTER RELEVENT A-Z TERM (IF NEEDED)')
      s.prop2 = window.location.href
      s.prop26 = this.pageName
      s.prop30 = this.pageName
      s.prop31 = window.location.href
      s.prop46 = window.location.href
      s.server = window.location.hostname

      // Update the level variables here.
      updateVariables(window.s)

      /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
      var s_code = s.t()
      if (s_code) {
        document.write(s_code)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  hoistNonReactStatic(AdobeAnalyticsTracking, WrappedComponent)
  return AdobeAnalyticsTracking
}

export default withTracking