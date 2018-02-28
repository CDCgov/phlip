import projectLogic from './Home/logic'
import userLogic from './Admin/logic'
import loginLogic from './Login/logic'
import codingSchemeLogic from './CodingScheme/logic'
import codingLogic from './Coding/logic'
import validationLogic from './Validation/logic'
import protocolLogic from './Protocol/logic'

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  ...codingSchemeLogic,
  ...codingLogic,
  ...validationLogic,
  ...protocolLogic
]