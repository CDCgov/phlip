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
    toggleCoderAnnotations: jest.fn()
  },
  alert: {
    open: false,
    title: '',
    text: '',
    data: {},
    type: ''
  }
}

const annoModeAlert = {
  open: true,
  title: 'Close Annotation Mode',
  text: 'You are currently in annotation mode. To make changes to your answer or to change questions, please exit annotation mode by clicking the \'Done\' button.',
  type: 'disableAnnoMode'
}

const categoryAlert = {
  text: 'Deselecting a category will remove any answers associated with this category. Do you want to continue?',
  title: 'Warning',
  type: 'changeAnswer',
  data: { id: 2, value: 3 },
  open: true
}

const changeAnswerAlert = {
  ...categoryAlert,
  text: 'Changing your answer will remove any pincites and annotations associated with this answer. Do you want to continue?'
}

const clearAlert = {
  ...categoryAlert,
  type: 'clearAnswer',
  text: 'Are you sure you want to clear your answer?',
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
      }
    )
  })
  
  describe('changing answer', () => {
    test('should call props.actions.setAlert with disable annotation mode info if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().onChangeAnswer(2)({}, {})
      expect(spy).toHaveBeenCalledWith(annoModeAlert)
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
        wrapper.find('Alert').at(0).prop('actions')[0].onClick()
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
        wrapper.find('Alert').at(0).prop('actions')[1].onClick()
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
  
  describe('toggling coder annotations', () => {
    test('should show an alert if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().onToggleCoderAnnotations(2, 2, false)()
      expect(spy).toHaveBeenCalledWith(annoModeAlert)
    })
    
    test('should call toggleCoderAnnotations if not in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleCoderAnnotations')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().onToggleCoderAnnotations(2, 2, false)()
      expect(spy).toHaveBeenCalledWith(1, 2, 2, false)
    })
  })
  
  describe('changing categories', () => {
    test('should show an alert if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
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
      expect(spy).toHaveBeenCalledWith(annoModeAlert)
    })
    
    test('should change categories if not in annotation mode', () => {
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
    test('should call props.actions.setAlert with disable annotation mode info if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().onClearAnswer()
      expect(spy).toHaveBeenCalledWith(annoModeAlert)
    })
    
    test('should call props.setAlert with clear answer alert information if not in annotation mode', () => {
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
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
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
      wrapper.find('Alert').at(0).prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('applying answer to all categories', () => {
    test('should show an alert if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
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
      expect(spy).toHaveBeenCalledWith(annoModeAlert)
    })
    
    test('should apply to all categories if not in annotation mode', () => {
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
