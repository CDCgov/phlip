const documentation = require('documentation')
const fs = require('fs')
const paths = require('../config/paths')
const path = require('path')
const rimraf = require('rimraf')
const styleguidist = require('react-styleguidist')(require('../styleguide.config'))

const utilFiles = fs.readdirSync(path.join(paths.appSrc, 'utils'))
const docsDir = path.resolve('docs')
let promises = []
const IS_BUILD = process.argv[2] === 'build'

const generateDocumentation = (utilFile, utilFileName) => {
  return new Promise((resolve, reject) => {
    documentation.build([utilFile], {})
      .then(comments => documentation.formats.md(comments, {}))
      .then(output => {
        fs.writeFileSync(path.join(docsDir, utilFileName), output)
        resolve()
      })
  })
}

if (fs.existsSync(docsDir) && docsDir !== '/') {
  rimraf.sync(docsDir)
}

fs.mkdirSync(docsDir)

for (let i = 0; i < utilFiles.length; i++) {
  const utilFile = path.resolve('src/utils', utilFiles[i])
  const utilFileName = `${utilFiles[i].split('.')[0]}.md`
  promises.push(generateDocumentation(utilFile, utilFileName))
}

Promise.all(promises).then(data => {
  if (IS_BUILD) {
    console.log('here')
    styleguidist.build((err, config) => {
      if (err) {
        console.log(`Error: ${err} building docs`)
        process.exit(1)
      } else {
        console.log(`Docs published to ${config.styleguideDir}`)
        process.exit(0)
      }
    })
  } else {
    styleguidist.server((err, config) => {
      if (err) {
        console.log(err)
      } else {
        const url = `http://${config.serverHost}:${config.serverPort}`
        console.log(`Listening at ${url}`)
      }
    })
  }
})