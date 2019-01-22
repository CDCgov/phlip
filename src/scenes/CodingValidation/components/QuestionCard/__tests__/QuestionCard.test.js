import React from 'react'
import { shallow } from 'enzyme'
import { QuestionCard } from '../index'
import * as questionTypes from '../../../constants'

const props = {
  question: { id: 1, answers: [], questionType: questionTypes.BINARY },
  userAnswers: {},
  onChange: (id) => jest.fn(),
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
  enabledAnswerChoice: null,
  areDocsEmpty: false
}

describe('QuestionCard component', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionCard {...props} />)).toMatchSnapshot()
  })

  describe('changing answer alert', () => {
    test('should show an alert if the user tries to change a binary answer', () => {
      const wrapper = shallow(<QuestionCard {...props} userAnswers={{
        answers: {
          1: { schemeAnswerId: 1 }
        }
      }} />)
      wrapper.instance().onChangeAnswer(2)({}, {})
      const alert = wrapper.find('Alert').at(0)
      expect(alert.props().open).toEqual(true)
    })

    test('should show an alert if the user tries to change a multiple choice answer', () => {
      const wrapper = shallow(
        <QuestionCard
          {...props}
          question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
          userAnswers={{
            answers: {
              2: { schemeAnswerId: 2 }
            }
          }}
        />
      )

      wrapper.instance().onChangeAnswer(3)({}, {})
      const alert = wrapper.find('Alert').at(0)
      expect(alert.props().open).toEqual(true)
    })

    test('should show an alert if the user tries to uncheck a selected checkbox answer', () => {
      const wrapper = shallow(
        <QuestionCard
          {...props}
          question={{ questionType: questionTypes.CHECKBOXES }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
        />
      )

      wrapper.instance().onChangeAnswer(2)({}, {})
      const alert = wrapper.find('Alert').at(0)
      expect(alert.props().open).toEqual(true)
    })

    test('should not show an alert if the user has not answered the question', () => {
      const wrapper = shallow(
        <QuestionCard
          {...props}
          question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
          userAnswers={{
            answers: {}
          }}
        />
      )

      wrapper.instance().onChangeAnswer(2)({}, {})
      const alert = wrapper.find('Alert').at(0)
      expect(alert.props().open).toEqual(false)
    })

    test('should not show an alert if the user has not chosen the selected checkbox', () => {
      const wrapper = shallow(
        <QuestionCard
          {...props}
          question={{ questionType: questionTypes.CHECKBOXES }}
          userAnswers={{
            answers: {
              4: { schemeAnswerId: 4 }
            }
          }}
        />
      )

      wrapper.instance().onChangeAnswer(2)({}, {})
      const alert = wrapper.find('Alert').at(0)
      expect(alert.props().open).toEqual(false)
    })

    test('should call this.props.onChange if the user has not answered the question', () => {
      const spy = jest.spyOn(props, 'onChange')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          question={{ questionType: questionTypes.CHECKBOXES }}
          userAnswers={{
            answers: {}
          }}
        />
      )

      wrapper.instance().onChangeAnswer(2)({}, {})
      expect(spy).toHaveBeenCalled()
    })
  })
})