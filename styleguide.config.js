const path = require('path')

module.exports = {
  webpackConfig: require('./config/webpack.dev.config')({}),
  styleguideDir: path.join(__dirname, 'docs'),
  logger: {
    warn: console.warn,
    info: console.info,
    debug: console.log
  },
  sections: [
    {
      name: 'Scenes',
      content: 'src/scenes/scenes.md',
      components: 'src/scenes/*/index.js'
    },
    {
      name: 'UI Components',
      components: 'src/components/!(withFormAlert|CodingValidation|withTracking|MultiSelectDropdown|Popover)/*.js',
      ignore: '**/src/components/@(Layout|RoutePages)/index.js'
    },
    {
      name: 'Higher Order Components',
      sections: [
        { name: 'withFormAlert', content: 'src/components/withFormAlert/Readme.md' },
        { name: 'withCodingValidation', content: 'src/components/withTracking/Readme.md' },
        { name: 'withTracking', content: '' }
      ]
    },
    {
      name: 'Utility',
      sections: [
        {
          name: 'codingHelpers',
          content: 'docs/codingHelpers.md',
          description: 'Functions that are primarily used in components/CodingValidation, scenes/Coding and scenes/Validation.'
        },
        {
          name: 'formHelpers',
          content: 'docs/formHelpers.md',
          description: 'Functions that are used in any of the forms in the application.'
        },
        {
          name: 'normalize',
          content: 'docs/normalize.md',
          description: 'Generic normalization functions'
        },
        {
          name: 'searchBar',
          content: 'docs/searchBar.md',
          description: 'Generic methods to make searching for values easier'
        },
        {
          name: 'commonHelpers',
          content: 'docs/commonHelpers.md',
          description: 'Generic helpers used throughout the application'
        }
      ]
    }
  ],
  showCode: true,
  showUsage: true,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'config/styleguide/ThemeWrapper'),
    SectionsRenderer: path.join(__dirname, 'config/styleguide/SectionsRenderer'),
    StyleGuideRenderer: path.join(__dirname, 'config/styleguide/StyleGuideRenderer'),
    ExamplePlaceholderRenderer: path.join(__dirname, 'config/styleguide/ExamplePlaceholderRenderer')
  },
  theme: {
    fontFamily: {
      base: [
        'Roboto',
        'sans-serif'
      ]
    }
  },
  styles: {
    ComponentsList: {
      heading: {
        fontWeight: '600 !important',
        fontSize: 16
      },
      isChild: {
        fontSize: 13,
        fontWeight: 'lighter'
      }
    }
  }
}