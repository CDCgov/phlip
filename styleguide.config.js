const path = require('path')

module.exports = {
  webpackConfig: require('./config/webpack.dev.config')({}),
  sections: [
    {
      name: 'Scenes',
      content: 'src/scenes/scenes.md',
      components: 'src/scenes/*/index.js'
    },
    {
      name: 'UI Components',
      components: 'src/components/*/index.js'
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
    StyleGuideRenderer: path.join(__dirname, 'config/styleguide/StyleGuideRenderer')
  }
}