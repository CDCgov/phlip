import { types } from '../actions'
import { INITIAL_STATE, COMBINED_INITIAL_STATE, default as codingValidationReducer } from '../reducer'
import { schemeById, userAnswersCoded } from 'utils/testData/coding'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...COMBINED_INITIAL_STATE,
  coding: {
    ...initial,
    ...other
  }
})

const reducer = (state, action) => {
  return codingValidationReducer(state, action).coding
}

describe('CodingValidation reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ ...COMBINED_INITIAL_STATE.coding, showNextButton: false })
  })

  describe('UPDATE_USER_ANSWER', () => {
    const currentState = getState({
      question: {
        text: 'fa la la la',
        questionType: 1,
        id: 1,
        parentId: 0,
        positionInParent: 0,
        possibleAnswers: [{ id: 123, text: 'answer 1' }, { id: 234, text: 'answer 2' }]
      },
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 1 },
        3: { parentId: 0, positionInParent: 2 },
        4: { parentId: 3, positionInParent: 0 }
      },
      scheme: {
        byId: {
          1: {
            text: 'fa la la la',
            hint: '',
            questionType: 1,
            id: 1,
            parentId: 0,
            positionInParent: 0,
            possibleAnswers: []
          },
          2: {
            text: 'la la la',
            hint: '',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: []
          },
          3: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            hint: '',
            positionInParent: 2,
            possibleAnswers: [
              { id: 5, text: 'category 1', order: 1 }, { id: 10, text: 'category 2', order: 2 },
              { id: 20, text: 'category 3', order: 3 }
            ]
          },
          4: {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            hint: '',
            positionInParent: 0,
            indent: 2,
            isCategoryQuestion: true,
            possibleAnswers: [
              { id: 432, text: 'answer 1', order: 1 }, { id: 2124, text: 'answer 2', order: 2 }
            ]
          }
        },
        order: [1, 2, 3, 4],
        tree: [
          { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: false },
          { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
          {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            isAnswered: true,
            indent: 1,
            possibleAnswers: [
              { id: 5, text: 'category 1', order: 1 }, { id: 10, text: 'category 2', order: 2 },
              { id: 20, text: 'category 3', order: 3 }
            ],
            children: [
              {
                text: 'cat question child',
                questionType: 3,
                isCategoryQuestion: true,
                id: 4,
                indent: 2,
                parentId: 3,
                positionInParent: 0,
                isAnswered: false,
                possibleAnswers: [
                  { id: 432, text: 'answer 1', order: 1 }, { id: 2124, text: 'answer 2', order: 2 }
                ]
              }
            ]
          }
        ]
      },
      userAnswers: {
        1: {
          answers: {},
          schemeQuestionId: 1,
          comment: ''
        },
        2: {
          answers: {},
          schemeQuestionId: 2,
          comment: ''
        },
        3: {
          schemeQuestionId: 3,
          answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
        },
        4: {
          10: { answers: {}, comment: '', flag: {} },
          20: { answers: {}, comment: '', flag: {} }
        }
      }
    })

    test('should handle binary / multiple choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER,
        answerId: 123,
        questionId: 1
      }

      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        1: {
          answers: { 123: { schemeAnswerId: 123, pincite: '', annotations: '[]' } },
          schemeQuestionId: 1,
          comment: ''
        }
      })

      expect(state).toHaveProperty('scheme.tree', [
        {
          text: 'fa la la la',
          hint: '',
          questionType: 1,
          id: 1,
          parentId: 0,
          positionInParent: 0,
          isAnswered: true,
          possibleAnswers: []
        },
        {
          text: 'la la la',
          hint: '',
          questionType: 3,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          isAnswered: false,
          possibleAnswers: []
        },
        {
          text: 'cat question',
          questionType: 2,
          id: 3,
          hint: '',
          parentId: 0,
          positionInParent: 2,
          isAnswered: true,
          indent: 1,
          possibleAnswers: [
            { id: 5, text: 'category 1', order: 1 }, { id: 10, text: 'category 2', order: 2 },
            { id: 20, text: 'category 3', order: 3 }
          ],
          children: [
            {
              text: 'cat question child',
              questionType: 3,
              isCategoryQuestion: true,
              id: 4,
              hint: '',
              parentId: 3,
              positionInParent: 0,
              isAnswered: false,
              indent: 2,
              possibleAnswers: [
                { id: 432, text: 'answer 1', order: 1 }, { id: 2124, text: 'answer 2', order: 2 }
              ],
              children: [
                {
                  schemeAnswerId: 10,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  order: 2,
                  positionInParent: 1,
                  text: 'category 2',
                  isAnswered: false
                },
                {
                  schemeAnswerId: 20,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  order: 3,
                  positionInParent: 2,
                  text: 'category 3',
                  isAnswered: false
                }
              ],
              completedProgress: 0
            }
          ]
        }
      ])
    })

    test('should handle checkbox / category choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER,
        answerId: 90,
        questionId: 2
      }

      const state = reducer(
        {
          ...currentState,
          coding: {
            ...currentState.coding,
            question: {
              text: 'la la la',
              questionType: 3,
              id: 2,
              parentId: 0,
              positionInParent: 1,
              possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }]
            }
          }
        },
        action
      )

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          comment: '',
          schemeQuestionId: 2,
          answers: {
            90: { schemeAnswerId: 90, pincite: '', annotations: '[]' }
          }
        }
      })
    })
  })

  describe('ON_CHANGE_COMMENT', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment'
      }

      const currentState = getState({
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: { 1: { schemeAnswerId: 1 } },
            comment: ''
          }
        },
        question: { id: 2 }
      })

      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          answers: { 1: { schemeAnswerId: 1 } },
          comment: 'new comment'
        }
      })
    })

    test('should handle category questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment for cat 1'
      }

      const currentState = getState({
        question: {
          text: 'la la la',
          questionType: 2,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }],
          isCategoryQuestion: true
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: {
              answers: { 5: { schemeAnswerId: 5 } }, comment: 'comment for cat 1', flag: {}
            },
            2: {
              answers: {}, comment: 'comment for cat 2', flag: {}
            }
          }
        },
        selectedCategory: 0,
        selectedCategoryId: 3,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })

      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: {
            answers: { 5: { schemeAnswerId: 5 } }, comment: 'new comment for cat 1', flag: {}
          },
          2: {
            answers: {}, comment: 'comment for cat 2', flag: {}
          }
        }
      })
    })
  })

  describe('ON_CHANGE_PINCITE', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const currentState = getState({
        question: {
          questionType: 3,
          id: 2
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: {
              1: {
                schemeAnswerId: 1,
                pincite: ''
              },
              4: {
                schemeAnswerId: 4,
                pincite: ''
              }
            },
            comment: ''
          }
        }
      })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          answers: {
            1: {
              schemeAnswerId: 1,
              pincite: ''
            },
            4: {
              schemeAnswerId: 4,
              pincite: 'this is a pincite'
            }
          },
          comment: ''
        }
      })
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const currentState = getState({
        question: {
          questionType: 3,
          isCategoryQuestion: true,
          id: 2
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: {
              answers: {
                4: { schemeAnswerId: 4, pincite: 'pincite!' }
              },
              comment: ''
            },
            2: {
              answers: {
                4: { schemeAnswerId: 4, pincite: '' }
              },
              comment: ''
            }
          }
        },
        selectedCategory: 1,
        selectedCategoryId: 2,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: {
            answers: {
              4: { schemeAnswerId: 4, pincite: 'pincite!' }
            },
            comment: ''
          },
          2: {
            answers: {
              4: { schemeAnswerId: 4, pincite: 'this is a pincite' }
            },
            comment: ''
          }
        }
      })
    })
  })

  describe('ON_SAVE_ANNOTATION', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_SAVE_ANNOTATION,
        questionId: 1,
        answerId: 123,
        annotation: {
          text: 'text annotation',
          rects: []
        }
      }

      const currentState = getState({ question: schemeById[1], userAnswers: userAnswersCoded })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...userAnswersCoded,
        1: {
          ...userAnswersCoded[1],
          answers: {
            ...userAnswersCoded[1].answers,
            123: {
              ...userAnswersCoded[1].answers[123],
              annotations: '[{\"text\":\"text annotation\",\"rects\":[]}]'
            }
          }
        }
      })
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_SAVE_ANNOTATION,
        questionId: 4,
        answerId: 432,
        annotation: {
          text: 'text annotation', rects: []
        }
      }

      const currentState = getState({
        question: schemeById[4],
        userAnswers: userAnswersCoded,
        selectedCategory: 0,
        selectedCategoryId: 10,
        categories: [{ id: 10, text: 'cat 1' }, { id: 20, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        4: {
          ...currentState.coding.userAnswers[4],
          10: {
            ...currentState.coding.userAnswers[4][10],
            answers: {
              432: {
                ...currentState.coding.userAnswers[4][10].answers[432],
                annotations: '[{\"text\":\"text annotation\",\"rects\":[]}]'
              }
            }
          }
        }
      })
    })
  })

  describe('ON_CLEAR_ANSWER', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const currentState = getState({
        question: {
          questionType: 3,
          id: 2
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: {
              1: {
                schemeAnswerId: 1,
                pincite: ''
              },
              4: {
                schemeAnswerId: 4,
                pincite: ''
              }
            },
            comment: ''
          }
        }
      })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          answers: {},
          comment: ''
        }
      })
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const currentState = getState({
        question: {
          id: 2,
          questionType: 4,
          isCategoryQuestion: true
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: {
              answers: { 4: { schemeAnswerId: 4, pincite: 'pincite!' } },
              comment: ''
            },
            2: {
              answers: { 4: { schemeAnswerId: 4, pincite: '' } },
              comment: ''
            }
          }
        },
        selectedCategory: 0,
        selectedCategoryId: 3,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: { answers: {}, comment: '' },
          2: { answers: { 4: { schemeAnswerId: 4, pincite: '' } }, comment: '' }
        }
      })
    })

    test('should update scheme.tree for category questions', () => {
      const currentState = getState({
        question: {
          text: 'cat question',
          questionType: 2,
          id: 3,
          parentId: 0,
          hint: '',
          flags: [],
          expanded: true,
          positionInParent: 2,
          isAnswered: true,
          indent: 1,
          possibleAnswers: [
            { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
          ],
          children: [
            {
              text: 'cat question child',
              questionType: 3,
              isCategoryQuestion: true,
              id: 4,
              parentId: 3,
              positionInParent: 0,
              isAnswered: false,
              indent: 2,
              possibleAnswers: [{ id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }],
              children: [
                {
                  schemeAnswerId: 10,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  positionInParent: 0,
                  text: 'category 2',
                  isAnswered: false
                },
                {
                  schemeAnswerId: 20,
                  schemeQuestionId: 4,
                  indent: 3,
                  isCategory: true,
                  positionInParent: 1,
                  text: 'category 3',
                  isAnswered: false
                }
              ],
              completedProgress: 0
            }
          ]
        },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 },
          3: { parentId: 0, positionInParent: 2 },
          4: { parentId: 3, positionInParent: 0 }
        },
        scheme: {
          byId: {
            1: {
              text: 'fa la la la',
              questionType: 1,
              id: 1,
              parentId: 0,
              positionInParent: 0,
              flags: [],
              hint: '',
              possibleAnswers: []
            },
            2: {
              text: 'la la la',
              questionType: 3,
              id: 2,
              parentId: 0,
              positionInParent: 1,
              flags: [],
              hint: '',
              possibleAnswers: []
            },
            3: {
              text: 'cat question',
              questionType: 2,
              id: 3,
              parentId: 0,
              positionInParent: 2,
              flags: [],
              hint: '',
              possibleAnswers: [
                { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
              ]
            },
            4: {
              text: 'cat question child',
              questionType: 3,
              id: 4,
              parentId: 3,
              positionInParent: 0,
              indent: 2,
              isCategoryQuestion: true,
              possibleAnswers: [
                { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
              ]
            }
          },
          order: [1, 2, 3, 4],
          tree: [
            { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: true },
            { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
            {
              text: 'cat question',
              questionType: 2,
              id: 3,
              parentId: 0,
              positionInParent: 2,
              isAnswered: true,
              indent: 1,
              possibleAnswers: [
                { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
              ],
              children: [
                {
                  text: 'cat question child',
                  questionType: 3,
                  isCategoryQuestion: true,
                  id: 4,
                  parentId: 3,
                  positionInParent: 0,
                  isAnswered: false,
                  indent: 2,
                  possibleAnswers: [
                    { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
                  ],
                  children: [
                    {
                      schemeAnswerId: 10,
                      schemeQuestionId: 4,
                      indent: 3,
                      isCategory: true,
                      positionInParent: 0,
                      text: 'category 2',
                      isAnswered: false
                    },
                    {
                      schemeAnswerId: 20,
                      schemeQuestionId: 4,
                      indent: 3,
                      isCategory: true,
                      positionInParent: 1,
                      text: 'category 3',
                      isAnswered: false
                    }
                  ],
                  completedProgress: 0
                }
              ]
            }
          ]
        },
        userAnswers: {
          1: {
            answers: { 123: { schemeAnswerId: 123, pincite: '' } },
            schemeQuestionId: 1,
            comment: ''
          },
          2: {
            answers: {},
            schemeQuestionId: 2,
            comment: ''
          },
          3: {
            schemeQuestionId: 3,
            answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
          },
          4: {
            schemeQuestionId: 4,
            10: { answers: {}, comment: '' },
            20: { answers: {}, comment: '' }
          }
        }
      })

      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 3,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = reducer(currentState, action)
      expect(state).toHaveProperty('scheme.tree', [
        {
          text: 'fa la la la',
          questionType: 1,
          id: 1,
          parentId: 0,
          positionInParent: 0,
          isAnswered: true,
          flags: [],
          hint: '',
          possibleAnswers: []
        },
        {
          text: 'la la la',
          questionType: 3,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          isAnswered: false,
          flags: [],
          hint: '',
          possibleAnswers: []
        },
        {
          text: 'cat question',
          questionType: 2,
          id: 3,
          parentId: 0,
          positionInParent: 2,
          isAnswered: false,
          indent: 1,
          flags: [], hint: '', expanded: true,
          possibleAnswers: [
            { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
          ],
          children: []
        }
      ])
    })
  })

  describe('APPLY_ANSWER_TO_ALL', () => {
    const currentState = getState({
      question: {
        id: 4
      },
      categories: [{ id: 10, text: 'cat 1' }, { id: 20, text: 'cat 2' }],
      outline: {
        1: { parentId: 0, positionInParent: 0 },
        2: { parentId: 0, positionInParent: 1 },
        3: { parentId: 0, positionInParent: 2 },
        4: { parentId: 3, positionInParent: 0 }
      },
      scheme: {
        byId: {
          1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          2: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
          3: {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            possibleAnswers: [
              { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
            ]
          },
          4: {
            text: 'cat question child',
            questionType: 3,
            id: 4,
            parentId: 3,
            positionInParent: 0,
            indent: 2,
            isCategoryQuestion: true,
            possibleAnswers: [
              { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
            ]
          }
        },
        order: [1, 2, 3, 4],
        tree: [
          { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: false },
          { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1, isAnswered: false },
          {
            text: 'cat question',
            questionType: 2,
            id: 3,
            parentId: 0,
            positionInParent: 2,
            isAnswered: true,
            indent: 1,
            possibleAnswers: [
              { id: 5, text: 'category 1' }, { id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }
            ],
            children: [
              {
                text: 'cat question child',
                questionType: 3,
                isCategoryQuestion: true,
                id: 4,
                indent: 2,
                parentId: 3,
                positionInParent: 0,
                isAnswered: false,
                possibleAnswers: [
                  { id: 432, text: 'answer 1' }, { id: 2124, text: 'answer 2' }
                ]
              }
            ]
          }
        ]
      },
      selectedCategoryId: 10,
      userAnswers: {
        1: {
          answers: {},
          schemeQuestionId: 1,
          comment: ''
        },
        2: {
          answers: {},
          schemeQuestionId: 2,
          comment: ''
        },
        3: {
          schemeQuestionId: 3,
          answers: { 10: { schemeAnswerId: 10, pincite: '' }, 20: { schemeAnswerId: 20, pincite: '' } }
        },
        4: {
          10: { answers: { schemeAnswerId: 42, pincite: '' }, comment: '', categoryId: 10 },
          20: { answers: {}, comment: '', categoryId: 20 }
        }
      }
    })

    test('should apply answers to all categories', () => {
      const action = {
        type: types.ON_APPLY_ANSWER_TO_ALL,
        jurisdictionId: 1,
        projectId: 3,
        questionId: 4
      }

      const state = reducer(currentState, action)

      expect(state.userAnswers).toEqual({
        ...currentState.coding.userAnswers,
        4: {
          10: {
            answers: { schemeAnswerId: 42, pincite: '' },
            comment: '',
            categoryId: 10,
            id: undefined
          },
          20: {
            answers: { schemeAnswerId: 42, pincite: '' },
            comment: '',
            categoryId: 20,
            id: undefined
          }
        }
      })
    })
  })
})