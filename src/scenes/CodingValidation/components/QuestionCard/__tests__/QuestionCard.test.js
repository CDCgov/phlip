import React from 'react'
import { shallow } from 'enzyme'
import { QuestionCard } from '../index'
import * as questionTypes from '../../../constants'

const props = {
  question: { id: 1, answers: [], questionType: questionTypes.BINARY },
  userAnswers: {},
  onChange: () => jest.fn(),
  onChangeCategory: () => jest.fn(),
  onClearAnswer: jest.fn(),
  onOpenAlert: jest.fn(),
  isValidation: false,
  user: { id: 5, firstName: 'test', lastName: 'user' },
  categories: [],
  selectedCategory: null,
  selectedCategoryId: 0,
  mergedUserQuestions: {},
  disableAll: false,
  userImages: {},
  questionChangeLoader: false,
  isChangingQuestion: false,
  unsavedChanges: false,
  saveFailed: false,
  hasTouchedQuestion: false,
  enabledAnswerId: '',
  enabledUserId: '',
  annotationModeEnabled: false,
  areDocsEmpty: false,
  actions: {
    toggleAnnotationMode: jest.fn(),
    setAlert: jest.fn(),
    closeAlert: jest.fn(),
    toggleViewAnnotations: jest.fn()
  },
  alert: {
    open: false,
    title: '',
    text: '',
    data: {},
    type: ''
  }
}

const categoryAlert = {
  text: 'Deselecting a category will remove answers, pincites and annotations associated with this category. Do you want to continue?',
  title: 'Warning',
  type: 'changeAnswer',
  data: { id: 2, value: 3 },
  open: true
}

const changeAnswerAlert = {
  ...categoryAlert,
  text: 'Changing your answer will remove the pincites and annotations associated with this answer. Do you want to continue?'
}

const clearAlert = {
  ...categoryAlert,
  type: 'clearAnswer',
  text: 'Clearing your answer will remove the selected answer choice, pincites and annotations associated with this answer. Do you want to continue?',
  data: {}
}

describe('QuestionCard component', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionCard {...props} />)).toMatchSnapshot()
  })
  
  describe('toggling annotation mode', () => {
    test(
      'should call actions.toggleAnnotationMode with enabled === true if annotationMode is not currently enabled',
      () => {
        const wrapper = shallow(<QuestionCard {...props} userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }} />)
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().onToggleAnnotationMode(1)()
        expect(spy).toHaveBeenCalledWith(1, 1, true)
        spy.mockReset()
      }
    )
    
    test(
      'should call actions.toggleAnnotationMode with enabled === false if annotationMode is enabled and enableAnswerId is same as parameter',
      () => {
        const wrapper = shallow(
          <QuestionCard
            {...props}
            annotationModeEnabled
            enabledAnswerId={1}
            userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
          />
        )
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().onToggleAnnotationMode(1)()
        expect(spy).toHaveBeenCalledWith(1, 1, false)
        spy.mockReset()
      }
    )
    
    test(
      'should call actions.toggleAnnotationMode with enabled === true and new answerId if enabled and enabledAnswerId !== parameter',
      () => {
        const wrapper = shallow(
          <QuestionCard
            {...props}
            annotationModeEnabled
            enabledAnswerId={1}
            userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
          />
        )
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().onToggleAnnotationMode(2)()
        expect(spy).toHaveBeenCalledWith(1, 2, true)
        spy.mockReset()
      }
    )
  })
  
  describe('changing answer', () => {
    test('should call disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().onChangeAnswer(2)({}, {})
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    describe('unselecting a category choice', () => {
      test('should call props.setAlert with category question information', () => {
        const spy = jest.spyOn(props.actions, 'setAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
        />)
        wrapper.instance().onChangeAnswer(2)({}, 3)
        expect(spy).toHaveBeenCalledWith(categoryAlert)
      })
      
      test('should show an alert', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual(categoryAlert.text)
        expect(wrapper.find('Alert').at(0).prop('title')).toEqual(categoryAlert.title)
      })
      
      test('should close the alert when \'Cancel\' button in alert is clicked', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        wrapper.find('Alert').at(0).prop('onCloseAlert')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should change answer when \'Continue\' button in alert is clicked', () => {
        const spy = jest.spyOn(props, 'onChange')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        wrapper.find('Alert').at(0).prop('actions')[0].onClick()
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('changing a non-category answer', () => {
      test('should call props.setAlert with changing answer alert information', () => {
        const spy = jest.spyOn(props.actions, 'setAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 }
            }
          }}
        />)
        wrapper.instance().onChangeAnswer(2)({}, 3)
        expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
      })
      
      test('should show an alert if the user tries to change a binary answer', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 }
            }
          }}
          alert={changeAnswerAlert}
        />)
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual(changeAnswerAlert.text)
        expect(wrapper.find('Alert').at(0).prop('title')).toEqual(changeAnswerAlert.title)
      })
      
      test(
        'should call props.setAlert with changing answer alert information if the user tries to change a multiple choice answer',
        () => {
          const spy = jest.spyOn(props.actions, 'setAlert')
          const wrapper = shallow(<QuestionCard
            {...props}
            question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
            userAnswers={{
              answers: {
                3: { schemeAnswerId: 3 }
              }
            }}
          />)
          
          wrapper.instance().onChangeAnswer(2)({}, 3)
          expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
        }
      )
      
      test(
        'should call props.setAlert with changing answer alert information if the user tries to uncheck a selected checkbox answer',
        () => {
          const spy = jest.spyOn(props.actions, 'setAlert')
          const wrapper = shallow(<QuestionCard
            {...props}
            question={{ questionType: questionTypes.CHECKBOXES }}
            userAnswers={{
              answers: {
                1: { schemeAnswerId: 1 },
                2: { schemeAnswerId: 2 }
              }
            }}
          />)
          
          wrapper.instance().onChangeAnswer(2)({}, 3)
          expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
        }
      )
      
      test('should not show an alert if the user has not answered the question', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
          userAnswers={{
            answers: {}
          }}
        />)
        
        wrapper.instance().onChangeAnswer(2)({}, {})
        const alert = wrapper.find('Alert').at(0)
        expect(alert.props().open).toEqual(false)
      })
      
      test('should not show an alert if the user has not chosen the selected checkbox', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CHECKBOXES }}
          userAnswers={{
            answers: {
              4: { schemeAnswerId: 4 }
            }
          }}
        />)
        
        wrapper.instance().onChangeAnswer(2)({}, {})
        const alert = wrapper.find('Alert').at(0)
        expect(alert.props().open).toEqual(false)
      })
    })
  })
  
  describe('toggling view annotations', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
        enabledAnswerId={1}
      />)
      wrapper.instance().onToggleViewAnnotations(2)()
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    test('should call toggleViewAnnotatoins', () => {
      const spy = jest.spyOn(props.actions, 'toggleViewAnnotations')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().onToggleViewAnnotations(1)()
      expect(spy).toHaveBeenCalledWith(1, 1)
    })
  })
  
  describe('changing categories', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().onChangeCategory({}, 2)
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should change categories', () => {
      const spy = jest.spyOn(props, 'onChangeCategory')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().onChangeCategory({}, 2)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('clearing answer', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().onClearAnswer()
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    test('should call props.setAlert with clear answer alert information', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().onClearAnswer()
      expect(spy).toHaveBeenCalledWith(clearAlert)
    })
  
    test('should close the alert when \'Cancel\' button in alert is clicked', () => {
      const spy = jest.spyOn(props.actions, 'closeAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearAlert}
      />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
  
    test('should clear answer when \'Continue\' button in alert is clicked', () => {
      const spy = jest.spyOn(props, 'onClearAnswer')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearAlert}
      />)
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('applying answer to all categories', () => {
    test('should disable annotation mode if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().onApplyAll()
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should apply to all categories', () => {
      const spy = jest.spyOn(props, 'onOpenAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().onApplyAll()
      expect(spy).toHaveBeenCalled()
    })
  })
})
