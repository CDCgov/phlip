const path = require('path')
const styles = require('./config/styleguide').stylguideStyles
const theme = require('./config/styleguide').styleguideTheme
const comps = require('./config/paths').styleguideComponents

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
      content: 'src/scenes/Readme.md',
      components: 'src/scenes/*/index.js'
    },
    {
      name: 'UI Components',
      content: 'src/components/Readme.md',
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
      name: 'Services',
      sections: [
        {
          name: 'api',
          content: 'docs/api.md'
        },
        {
          name: 'authToken',
          content: 'docs/authToken.md'
        },
        {
          name: 'store',
          content: 'src/services/store/Readme.md'
        },
        {
          name: 'theme',
          content: 'docs/theme.md',
          description: 'Setting up and initializing the Material UI Project Theme'
        }
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
          name: 'commonHelpers',
          content: 'docs/commonHelpers.md',
          description: 'Generic helpers used throughout the application'
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
          name: 'treeHelpers',
          content: 'docs/treeHelpers.md',
          description: 'Methods used when dealing with nested arrays (tree, ex. Code Navigator)'
        },
        {
          name: 'updater',
          content: 'docs/updater.md',
          description: 'Generic functions for updating items in objects and arrays'
        }
      ]
    }
  ],
  showCode: false,
  showUsage: true,
  styleguideComponents: {
    Wrapper: comps('ThemeWrapper'),
    SectionsRenderer: comps('SectionsRenderer'),
    StyleGuideRenderer: comps('StyleGuideRenderer'),
    ExamplePlaceholderRenderer: comps('ExamplePlaceholderRenderer'),
    HeadingRenderer: comps('HeadingRenderer'),
    SectionHeadingRenderer: comps('SectionHeadingRenderer')
  },
  theme,
  styles,
  getComponentPathLine: componentPath => {
    let name = path.basename(componentPath, '.js')
    const dir = path.dirname(componentPath)
    const baseDir = dir.split('/')[dir.split('/').length - 1]

    if (name === 'rsgCodingValidation') {
      name = 'withCodingValidation'
    } else if (name === 'index') {
      name = baseDir
    } else if (name !== dir) {
      name = `{ ${name} }`
    }

    return `import ${name} from '${dir}'`
  }
}