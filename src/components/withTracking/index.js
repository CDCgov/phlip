import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

/**
 * @component
 */
export const withTracking = (WrappedComponent, pageName = null) => {
  class AdobeAnalyticsTracking extends Component {
    constructor(props, context) {
      super(props, context)
      this.pageName = null
    }

    componentDidMount() {
      this.pageName = pageName === 'Project Form'
        ? this.props.location.state.projectDefined === null ? 'Create New Project' : 'Project Details'
        : pageName

      if (this.pageName !== null && process.env.NODE_ENV === 'production') {
        this.updateSiteCatalystVariables()
      }
    }

    setPageName = pageName => {
      this.pageName = pageName
      this.updateSiteCatalystVariables()
    }

    updateSiteCatalystVariables = () => {
      window.s.pageName = this.pageName
      window.s.channel = 'Public Health Law'

      //* Center Name *
      window.siteCatalyst.setLevel1('OSTLTS')
      //* Division, Office or Program Name *
      window.siteCatalyst.setLevel2('Office of the Director')
      //* CDC Topic Name *
      window.siteCatalyst.setLevel3('Public Health Law')
      window.siteCatalyst.setLevel4('Public Health Law Investigation Platform')

      //siteCatalyst.setAzEntry('ENTER RELEVENT A-Z TERM (IF NEEDED)')
      window.s.prop2 = window.location.href
      window.s.prop26 = this.pageName
      window.s.prop30 = this.pageName
      window.s.prop31 = window.location.href
      window.s.prop46 = window.location.href
      window.s.server = window.location.hostname

      // Simplified URL
      window.s.prop73 = window.location.href.split('?')[0].split('#')[0].toLowerCase()
      window.s.eVar73 = window.location.href.split('?')[0].split('#')[0].toLowerCase()

      // Update the level variables here.
      window.updateVariables(window.s)

      /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
      var s_code = window.s.t()
      if (s_code) {
        window.document.write(s_code)
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