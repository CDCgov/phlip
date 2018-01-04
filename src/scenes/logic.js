import projectLogic from './Home/logic'
import userLogic from './Admin/logic'
import loginLogic from './Login/logic'
import codingSchemeLogic from './CodingScheme/logic'

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  ...codingSchemeLogic
]