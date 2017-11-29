import projectLogic from 'scenes/Home/logic'
import userLogic from 'scenes/Admin/logic'
import loginLogic from 'scenes/Login/logic'

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic
]