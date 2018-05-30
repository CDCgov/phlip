import projectLogic from './Home/logic'
import userLogic from './Admin/logic'
import loginLogic from './Login/logic'
import codingSchemeLogic from './CodingScheme/logic'
import codingLogic from './Coding/logic'
import validationLogic from './Validation/logic'
import protocolLogic from './Protocol/logic'
import codingValidationLogic from 'components/CodingValidation/logic'

/**
 * Collects all of the logic from scenes into one array
 */
export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  ...codingSchemeLogic,
  ...codingValidationLogic,
  ...codingLogic,
  ...validationLogic,
  ...protocolLogic
]