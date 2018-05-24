const path = require('path')
const styles = require('./config/styleguide').stylguideStyles
const theme = require('./config/styleguide').styleguideTheme

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
      components: 'src/components/CodingValidation/rsgCodingValidation.js',
      sections: [
        { name: 'withFormAlert', content: 'src/components/withFormAlert/Readme.md' },
        { name: 'withTracking', content: 'src/components/withTracking/Readme.md' }
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
  showCode: false,
  showUsage: true,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'config/styleguide/ThemeWrapper'),
    SectionsRenderer: path.join(__dirname, 'config/styleguide/SectionsRenderer'),
    StyleGuideRenderer: path.join(__dirname, 'config/styleguide/StyleGuideRenderer'),
    ExamplePlaceholderRenderer: path.join(__dirname, 'config/styleguide/ExamplePlaceholderRenderer'),
    HeadingRenderer: path.join(__dirname, 'config/styleguide/HeadingRenderer'),
    SectionHeadingRenderer: path.join(__dirname, 'config/styleguide/SectionHeadingRenderer')
  },
  theme,
  styles,
  getComponentPathLine: componentPath => {
    let name = path.basename(componentPath, '.js')
    const dir = path.dirname(componentPath)

    if (name === 'rsgCodingValidation') {
      name = 'withCodingValidation'
    } else if (name === 'index') {
      name = dir.split('/')[dir.split('/').length - 1]
    }

    return `import ${name} from '${dir}'`
  }
}