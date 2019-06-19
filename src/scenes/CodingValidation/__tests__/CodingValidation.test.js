import React from 'react'
import { shallow } from 'enzyme'
import { CodingValidation } from '../index'

const props = {
  project: { id: 1, name: 'Project Test', projectJurisdictions: [{ id: 11 }, { id: 10 }, { id: 20, name: 'florida' }] },
  page: 'coding',
  isValidation: false,
  question: { id: 1, text: 'question!' },
  currentIndex: 0,
  questionOrder: [1],
  showNextButton: false,
  isSchemeEmpty: false,
  areJurisdictionsEmpty: false,
  user: { id: 11, role: 'Admin' },
  selectedCategory: null,
  schemeError: null,
  updateAnswerError: null,
  answerErrorContent: null,
  saveFlagErrorContent: null,
  getQuestionErrors: null,
  match: { url: '/project/1/code', params: { id: 1, view: 'code' } },
  history: {
    replace: jest.fn()
  },
  actions: {
    getCodingOutlineRequest: jest.fn(),
    setPage: jest.fn(),
    getValidationOutlineRequest: jest.fn()
  },
  classes: {}
}

describe('CodingValidation', () => {
  test('should render Coding component correctly', () => {
    expect(shallow(<CodingValidation {...props} />)).toMatchSnapshot()
  })
  
  describe('setting page name', () => {
    test('should set document title to code if on coding', () => {
      shallow(
        <CodingValidation
          {...props}
          project={{
            name: 'Blep',
            id: 4,
            projectJurisdictions: []
          }}
        />
      )
      expect(document.title).toEqual('PHLIP - Blep - Code')
    })
    
    test('should set document title to validate if on validation', () => {
      shallow(
        <CodingValidation
          {...props}
          isValidation
          project={{
            name: 'Blep',
            id: 4,
            projectJurisdictions: []
          }}
        />
      )
      expect(document.title).toEqual('PHLIP - Blep - Validate')
    })
  })
  
  describe('getting outline', () => {
    test('should get coding outline if page is coding', () => {
      const spy = jest.spyOn(props.actions, 'getCodingOutlineRequest')
      shallow(<CodingValidation {...props} />)
      expect(spy).toHaveBeenCalled()
    })
    
    test('should get validation outline if page is validation', () => {
      const spy = jest.spyOn(props.actions, 'getValidationOutlineRequest')
      shallow(<CodingValidation {...props} isValidation page="validation" />)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('setting page text when jurisdictions or scheme is empty', () => {
    describe('when the page is coding', () => {
      test('should show no scheme started text is there is no scheme', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: true, areJurisdictionsEmpty: false })
        expect(wrapper.state().startedText).toEqual('You must add questions to the coding scheme before coding.')
      })
  
      test('should show no jurisdictions started text is there are no jurisdictions', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: false, areJurisdictionsEmpty: true })
        expect(wrapper.state().startedText).toEqual('You must add jurisdictions to the project before coding.')
      })
      
      test('should show combined no jur / questions when both sheme and jurisdictions are empty', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: true, areJurisdictionsEmpty: true })
        expect(wrapper.state().startedText).toEqual('You must add jurisdictions and questions to the coding scheme before coding.')
      })
      
      test('should show coordinators must add started text if the user\'s role is Coder', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress user={{ role: 'Coder' }} />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: true, areJurisdictionsEmpty: true })
        expect(wrapper.state().startedText).toEqual('The coordinator for this project has not created a coding scheme or added jurisdictions.')
      })
    })
    
    describe('when the page is validation', () => {
      test('should show no scheme started text is there is no scheme', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress isValidation />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: true, areJurisdictionsEmpty: false })
        expect(wrapper.state().startedText).toEqual('This project doesn\'t have a coding scheme.')
      })
  
      test('should show no jurisdictions started text is there are no jurisdictions', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress isValidation />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: false, areJurisdictionsEmpty: true })
        expect(wrapper.state().startedText).toEqual('This project doesn\'t have jurisdictions.')
      })
  
      test('should show combined no jur / questions when both sheme and jurisdictions are empty', () => {
        const wrapper = shallow(<CodingValidation {...props} getRequestInProgress isValidation />)
        wrapper.setProps({ getRequestInProgress: false, isSchemeEmpty: true, areJurisdictionsEmpty: true })
        expect(wrapper.state().startedText).toEqual('This project does not have a coding scheme or jurisdictions.')
      })
    })
  })
  
  describe('setting jurisdiction', () => {
    test('should set it to empty if there are no project jurisdictions', () => {
      const wrapper = shallow(
        <CodingValidation
          {...props}
          project={{
            id: 4,
            name: 'blep',
            projectJurisdictions: []
          }}
        />
      )
      expect(wrapper.state().jurisdiction).toEqual({ id: null })
    })
    
    test('should use route param if one is present', () => {
      const wrapper = shallow(<CodingValidation {...props} match={{ params: { jid: 20 } }} />)
      expect(wrapper.state().jurisdiction).toEqual({ id: 20, name: 'florida' })
    })
    
    test('should use first jurisdiction if no route param is present', () => {
      const wrapper = shallow(<CodingValidation {...props} />)
      expect(wrapper.state().jurisdiction).toEqual({ id: 11 })
    })
  })
  
  describe('changing routes', () => {
    test('should change routes if component updated and has a new question', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.setProps({ question: { id: 32 } })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/11/32' })
      spy.mockReset()
    })
    
    test('should change routes if component is updated and has a new jurisdiction', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.setState({ jurisdiction: { id: 20 } })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/20/1' })
      spy.mockReset()
    })
    
    test('should change routes after load and scheme isn\'t empty', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} getRequestInProgress />)
      wrapper.setProps({ getRequestInProgress: false })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/11/1' })
      spy.mockReset()
    })
    
    test('should not change the route if scheme or jurisdictions are empty', () => {
      const spy = jest.spyOn(props.history, 'replace')
      shallow(<CodingValidation {...props} isSchemeEmpty areJurisdictionsEmpty />)
      expect(spy).not.toHaveBeenCalled()
    })
  })  
})
