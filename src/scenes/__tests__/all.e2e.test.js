const commonElements = require('./commonElement')
// import { addProject } from'../Home/__tests__/addProject.e2e.test.js'

import { addProject } from'../Home/__tests__/projectSetup.e2e.test'
import { removeProject } from'../Home/__tests__/removeProject.e2e.test.js'
import { docManage } from '../DocumentManagement/__tests__/docManagement.e2e.test.js'
import { docView } from '../DocumentView/__tests__/docView.e2e.test.js'

describe('Project Screen', addProject)
// describe('Project Screen', removeProject)
// describe('Document Management', docManage)
// describe('Document View', docView)
