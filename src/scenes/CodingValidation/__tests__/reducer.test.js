import * as types from '../actionTypes'
import { createCodingValidationReducer } from '../reducer'

const initial = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: null
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => createCodingValidationReducer(() => {
}, [], 'CODING')(state, action)

describe('CodingValidation reducer', () => {
  describe('UPDATE_USER_ANSWER_REQUEST', () => {
    const currentState = {
      question: {
        text: 'fa la la la',
        questionType: 1,
        id: 1,
        parentId: 0,
        positionInParent: 0,
        possibleAnswers: [{ id: 123, text: 'answer 1', id: 234, text: 'answer 2' }]
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
    }

    test('should handle binary / multiple choice type questions', () => {
      const action = {
        type: `${types.UPDATE_USER_ANSWER}_CODING`,
        answerId: 123,
        questionId: 1
      }

      const state = getReducer(getState(currentState), action)

      expect(state).toEqual(getState({
        ...currentState,
        userAnswers: {
          ...currentState.userAnswers,
          1: {
            answers: { 123: { schemeAnswerId: 123, pincite: '' } },
            schemeQuestionId: 1,
            comment: ''
          }
        },
        unsavedChanges: true
      }))

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
        type: `${types.UPDATE_USER_ANSWER}_CODING`,
        answerId: 90,
        questionId: 2
      }

      const state = getReducer(
        getState({
          ...currentState,
          question: {
            text: 'la la la',
            questionType: 3,
            id: 2,
            parentId: 0,
            positionInParent: 1,
            possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }]
          }
        }),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: {
          text: 'la la la',
          questionType: 3,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }]
        },
        userAnswers: {
          ...currentState.userAnswers,
          2: {
            comment: '',
            schemeQuestionId: 2,
            answers: {
              90: { schemeAnswerId: 90, pincite: '' }
            }
          }
        },
        unsavedChanges: true
      }))
    })
  })

  describe('ON_CHANGE_COMMENT', () => {
    test('should handle regular questions', () => {
      const action = {
        type: `${types.ON_CHANGE_COMMENT}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment'
      }

      const state = getReducer(
        getState({
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: { 1: { schemeAnswerId: 1 } },
              comment: ''
            }
          },
          question: { id: 2 }
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: { id: 2 },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: { 1: { schemeAnswerId: 1 } },
              comment: 'new comment'
            }
          },
          showNextButton: false,
          unsavedChanges: true
        })
      )

    })

    test('should handle category questions', () => {
      const action = {
        type: `${types.ON_CHANGE_COMMENT}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment for cat 1'
      }

      const state = getReducer(
        getState({
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
        }),
        action
      )

      expect(state).toEqual(
        getState({
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
                answers: { 5: { schemeAnswerId: 5 } }, comment: 'new comment for cat 1', flag: {}
              },
              2: {
                answers: {}, comment: 'comment for cat 2', flag: {}
              }
            }
          },
          showNextButton: false,
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }],
          unsavedChanges: true
        })
      )
    })
  })

  describe('ON_CHANGE_PINCITE', () => {
    test('should handle regular questions', () => {
      const action = {
        type: `${types.ON_CHANGE_PINCITE}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const state = getReducer(
        getState({
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
        }),
        action
      )

      expect(state).toEqual(
        getState({
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
                  pincite: 'this is a pincite'
                }
              },
              comment: ''
            }
          },
          showNextButton: false,
          unsavedChanges: true
        })
      )
    })

    test('should handle category child questions', () => {
      const action = {
        type: `${types.ON_CHANGE_PINCITE}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }

      const state = getReducer(
        getState({
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
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            id: 2,
            questionType: 3,
            isCategoryQuestion: true
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
                  4: { schemeAnswerId: 4, pincite: 'this is a pincite' }
                },
                comment: ''
              }
            }
          },
          unsavedChanges: true,
          selectedCategory: 1,
          showNextButton: false,
          selectedCategoryId: 2,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
    })
  })

  describe('ON_CLEAR_ANSWER', () => {
    test('should handle regular questions', () => {
      const action = {
        type: `${types.ON_CLEAR_ANSWER}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(
        getState({
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
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            id: 2,
            questionType: 3
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              answers: {},
              comment: ''
            }
          },
          showNextButton: false,
          unsavedChanges: true
        })
      )
    })

    test('should handle category child questions', () => {
      const action = {
        type: `${types.ON_CLEAR_ANSWER}_CODING`,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(
        getState({
          question: {
            id: 2,
            questionType: 4,
            isCategoryQuestion: true
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
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            id: 2,
            questionType: 4,
            isCategoryQuestion: true
          },
          userAnswers: {
            2: {
              schemeQuestionId: 2,
              3: {
                answers: {}, comment: ''
              },
              2: {
                answers: {
                  4: { schemeAnswerId: 4, pincite: '' }
                },
                comment: ''
              }
            }
          },
          selectedCategory: 0,
          selectedCategoryId: 3,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }],
          showNextButton: false,
          unsavedChanges: true
        })
      )
    })

    test('should update scheme.tree for category questions', () => {
      const currentState = {
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
      }

      const action = {
        type: `${types.ON_CLEAR_ANSWER}_CODING`,
        questionId: 3,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(currentState, action)
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
    const currentState = {
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
    }

    test('should apply answers to all categories', () => {
      const action = {
        type: `${types.ON_APPLY_ANSWER_TO_ALL}_CODING`,
        jurisdictionId: 1,
        projectId: 3,
        questionId: 4
      }

      const state = getReducer(getState(currentState), action)

      expect(state).toEqual(getState({
        ...currentState,
        userAnswers: {
          ...currentState.userAnswers,
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
        },
        showNextButton: false,
        unsavedChanges: true
      }))
    })
  })

})