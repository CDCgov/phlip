const documentation = require('documentation')
const fs = require('fs')
const paths = require('../config/paths')
const path = require('path')
const rimraf = require('rimraf')
const styleguidist = require('react-styleguidist')(require('../styleguide.config'))

const utilFiles = fs.readdirSync(path.join(paths.appSrc, 'utils'))
const serviceFiles = fs.readdirSync(path.join(paths.appSrc, 'services'))

const docsDir = path.resolve('docs')
let promises = []
const IS_BUILD = process.argv[2] === 'build'

const generateDocumentation = (utilFile, utilFileName) => {
  return new Promise(resolve => {
    const outputFile = path.join(docsDir, `${utilFileName}.md`)
    documentation.build([utilFile], {})
      .then(comments => documentation.formats.md(comments, {}))
      .then(output => {
        const readmeFile = path.join(path.dirname(utilFile), utilFileName, 'Readme.md')
        if (fs.existsSync(readmeFile)) {
          fs.copyFileSync(readmeFile, outputFile)
          fs.appendFileSync(outputFile, output)
        } else {
          fs.writeFileSync(outputFile, output)
        }
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
  const utilFileName = utilFiles[i].split('.')[0]
  promises.push(generateDocumentation(utilFile, utilFileName))
}

for (let i = 0; i < serviceFiles.length; i++) {
  const serviceFile = path.resolve('src/services', serviceFiles[i])
  const serviceFileName = serviceFiles[i].split('.')[0]
  promises.push(generateDocumentation(serviceFile, serviceFileName))
}

Promise.all(promises).then(data => {
  if (IS_BUILD) {
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