import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance, projectApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'

describe('CodingValidation logic', () => {})