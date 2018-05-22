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
      components: 'src/components/!(withFormAlert|CodingValidation|withTracking|MultiSelectDropdown)/*.js',
      ignore: '**/src/components/Layout/index.js'
    },
    {
      name: 'Higher Order Components',
      components: [
        'src/components/withFormAlert/index.js', 'src/components/CodingValidation/index.js',
        'src/components/withTracking/index.js'
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
  }
}