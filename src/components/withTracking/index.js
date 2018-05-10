import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

export const withTracking = (WrappedComponent, pageName) => {
  class AdobeAnalyticsTracking extends Component {
    constructor(props, context) {
      super(props, context)
    }

    componentDidMount() {
      window.s.pageName = pageName
      window.s.channel = 'PHLIP'

      //* Center Name *
      siteCatalyst.setLevel1('OSTLTS')
      //* Division, Office or Program Name *
      siteCatalyst.setLevel2('OD')
      //* CDC Topic Name *
      siteCatalyst.setLevel3('Public Health Law Program')

      //siteCatalyst.setAzEntry('ENTER RELEVENT A-Z TERM (IF NEEDED)')
      window.s.prop2 = window.location.href
      window.s.prop26 = pageName
      window.s.prop30 = pageName
      window.s.prop31 = window.location.href
      window.s.prop46 = window.location.href
      window.s.server = window.location.hostname

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