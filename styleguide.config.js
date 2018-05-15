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
      name: 'Utility Functions',
      sections: [
        { name: 'Coding / Validation', content: 'docs/codingHelpers.md' }
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