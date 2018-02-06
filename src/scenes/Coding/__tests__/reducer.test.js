import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {},
  showNextButton: true
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Coding reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_CODING_OUTLINE_SUCCESS', () => {
    test('should set outline, scheme, current question and userAnswers based on action.payload', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          scheme: questions,
          questionOrder: [1, 2],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 }
          },
          question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          codedQuestions: [{ codingSchemeQuestionId: 1, answers: [{ codingSchemeAnswerId: 3, pincite: '' }] }]
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual(getState({
        question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          },
          order: [1, 2]
        },
        userAnswers: {
          1: {
            answers: {
              3: { codingSchemeAnswerId: 3, pincite: '' }
            },
            codingSchemeQuestionId: 1
          }
        }
      }))
    })

    test('should initialize user answers to empty if payload.codedQuestions is empty', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          scheme: questions,
          questionOrder: [1, 2],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 }
          },
          question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
          codedQuestions: []
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual(getState({
        question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
          },
          order: [1, 2]
        },
        userAnswers: {
          1: {
            answers: {},
            codingSchemeQuestionId: 1,
            comment: ''
          }
        }
      }))
    })

    test('should handle category question children in codedQuestions array', () => {
      const questions = [
        { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
        { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 },
        { text: 'category question child', questionType: 4, id: 3, parentId: 2, positionInParent: 0 }
      ]

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          question: { id: 1 },
          scheme: questions,
          questionOrder: [1, 2, 3],
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 },
            3: { parentId: 2, positionInParent: 0 }
          },
          codedQuestions: [
            {
              codingSchemeQuestionId: 2,
              answers: [{ codingSchemeAnswerId: 4, pincite: '' }, { codingSchemeAnswerId: 5, pincite: '' }]
            },
            {
              codingSchemeQuestionId: 3,
              categoryId: 4,
              answers: [{ codingSchemeAnswerId: 8, pincite: '' }, { codingSchemeAnswerId: 6, pincite: '' }],
              comment: ''
            },
            {
              codingSchemeQuestionId: 3,
              categoryId: 5,
              answers: [{ codingSchemeAnswerId: 11, pincite: '' }, { codingSchemeAnswerId: 8, pincite: '' }],
              comment: 'this is a comment'
            }
          ]
        }
      }

      const state = getReducer(
        getState(),
        action
      )

      expect(state).toEqual(getState({
        question: { id: 1 },
        outline: {
          1: { parentId: 0, positionInParent: 0 },
          2: { parentId: 0, positionInParent: 1 },
          3: { parentId: 2, positionInParent: 0 }
        },
        scheme: {
          byId: {
            1: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
            2: { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 },
            3: { text: 'category question child', questionType: 4, id: 3, parentId: 2, positionInParent: 0 }
          },
          order: [1, 2, 3]
        },
        userAnswers: {
          2: {
            answers: {
              4: {codingSchemeAnswerId: 4, pincite: ''},
              5: {codingSchemeAnswerId: 5, pincite: ''}
            },
            codingSchemeQuestionId: 2
          },
          3: {
            codingSchemeQuestionId: 3,
            answers: {
              4: {
                answers: {
                  8: { codingSchemeAnswerId: 8, pincite: '' },
                  6: { codingSchemeAnswerId: 6, pincite: '' }
                }
              },
              5: {
                answers: {
                  11: { codingSchemeAnswerId: 11, pincite: '' },
                  8: { codingSchemeAnswerId: 8, pincite: '' }
                }
              }
            },
            comment: {
              4: '',
              5: 'this is a comment'
            }
          },
          1: {
            codingSchemeQuestionId: 1,
            answers: {},
            comment: ''
          }
        }
      }))

    })
  })

  describe('GET_NEXT_QUESTION && GET_PREV_QUESTION', () => {
    const currentState = {
      question: { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
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
          4: { text: 'cat question child', questionType: 3, id: 4, parentId: 3, positionInParent: 0 }
        },
        order: [1, 2, 3, 4]
      },
      userAnswers: {
        1: {
          answers: {},
          codingSchemeQuestionId: 1,
          comment: ''
        }
      }
    }

    test('should handle regular questions', () => {
      const action = {
        type: types.GET_NEXT_QUESTION,
        id: 2,
        newIndex: 1
      }

      const state = getReducer(
        getState(currentState),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
        currentIndex: 1,
        userAnswers: {
          1: {
            answers: {},
            codingSchemeQuestionId: 1,
            comment: ''
          },
          2: {
            answers: {},
            codingSchemeQuestionId: 2,
            comment: ''
          }
        }
      }))
    })

    test('should handle category question children', () => {
      const action = {
        type: types.GET_NEXT_QUESTION,
        id: 4,
        newIndex: 3
      }

      const state = getReducer(
        getState({
          ...currentState,
          userAnswers: {
            ...currentState.userAnswers,
            3: {
              codingSchemeQuestionId: 3,
              answers: { 10: { codingSchemeAnswerId: 10, pincite: '' }, 20: { codingSchemeAnswerId: 20, pincite: '' } }
            }
          }
        }),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: {
          text: 'cat question child',
          questionType: 3,
          id: 4,
          parentId: 3,
          positionInParent: 0,
          isCategoryChild: true
        },
        showNextButton: false,
        currentIndex: 3,
        userAnswers: {
          ...currentState.userAnswers,
          3: {
            codingSchemeQuestionId: 3,
            answers: { 10: { codingSchemeAnswerId: 10, pincite: '' }, 20: { codingSchemeAnswerId: 20, pincite: '' } }
          },
          4: {
            codingSchemeQuestionId: 4,
            answers: {
              10: { answers: {} },
              20: { answers: {} }
            },
            comment: {
              10: '',
              20: ''
            }
          }
        },
        categories: [{ id: 10, text: 'category 2' }, { id: 20, text: 'category 3' }]
      }))
    })

    test('should if next question is already in state.userAnswers', () => {
      const action = {
        type: types.GET_NEXT_QUESTION,
        id: 2,
        newIndex: 1
      }

      const state = getReducer(
        getState({
          ...currentState,
          userAnswers: {
            ...currentState.userAnswers,
            2: {
              codingSchemeQuestionId: 2,
              comment: 'this is a comment',
              answers: {}
            }
          }
        }),
        action
      )

      expect(state).toEqual(getState({
        ...currentState,
        question: { text: 'la la la', questionType: 3, id: 2, parentId: 0, positionInParent: 1 },
        currentIndex: 1,
        userAnswers: {
          ...currentState.userAnswers,
          2: {
            codingSchemeQuestionId: 2,
            comment: 'this is a comment',
            answers: {}
          }
        }
      }))
    })
  })

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
          4: { text: 'cat question child', questionType: 3, id: 4, parentId: 3, positionInParent: 0 }
        },
        order: [1, 2, 3, 4]
      },
      userAnswers: {
        1: {
          answers: {},
          codingSchemeQuestionId: 1,
          comment: ''
        },
        2: {
          answers: {},
          codingSchemeQuestionId: 2,
          comment: ''
        },
        3: {
          codingSchemeQuestionId: 3,
          answers: { 10: { codingSchemeAnswerId: 10, pincite: '' }, 20: { codingSchemeAnswerId: 20, pincite: '' } }
        },
        4: {
          codingSchemeQuestionId: 4,
          answers: {
            10: { answers: {} },
            20: { answers: {} }
          },
          comment: {
            10: '',
            20: ''
          }
        }
      }
    }

    test('should handle binary / multiple choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER_REQUEST,
        answerId: 123,
        questionId: 1
      }

      const state = getReducer(getState(currentState), action)

      expect(state).toEqual(getState({
        ...currentState,
        userAnswers: {
          ...currentState.userAnswers,
          1: {
            answers: { 123: { codingSchemeAnswerId: 123, pincite: '' } },
            codingSchemeQuestionId: 1,
            comment: ''
          }
        }
      }))
    })

    test('should handle checkbox / category choice type questions', () => {
      const action = {
        type: types.UPDATE_USER_ANSWER_REQUEST,
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
            codingSchemeQuestionId: 2,
            answers: {
              90: { codingSchemeAnswerId: 90, pincite: '' }
            }
          }
        }
      }))
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

      const state = getReducer(
        getState({
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: { 1: { codingSchemeAnswerId: 1 } },
              comment: ''
            }
          }
        }),
        action
      )

      expect(state).toEqual(
        getState({
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: { 1: { codingSchemeAnswerId: 1 } },
              comment: 'new comment'
            }
          }
        })
      )

    })

    test('should handle category questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
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
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: { codingSchemeAnswerId: 5 }
                },
                2: {
                  answers: {}
                }
              },
              comment: {
                3: 'comment for cat 1',
                2: 'comment for cat 2'
              }
            }
          },
          selectedCategory: 0,
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
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: { codingSchemeAnswerId: 5 }
                },
                2: {
                  answers: {}
                }
              },
              comment: {
                3: 'new comment for cat 1',
                2: 'comment for cat 2'

              }
            }
          },
          selectedCategory: 0,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
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

      const state = getReducer(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                1: {
                  codingSchemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  codingSchemeAnswerId: 4,
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
            questionType: 3
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                1: {
                  codingSchemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  codingSchemeAnswerId: 4,
                  pincite: 'this is a pincite'
                }
              },
              comment: ''
            }
          }
        })
      )
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

      const state = getReducer(
        getState({
          question: {
            questionType: 2,
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 1,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 2,
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: 'this is a pincite' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 1,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
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

      const state = getReducer(
        getState({
          question: {
            questionType: 3
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                1: {
                  codingSchemeAnswerId: 1,
                  pincite: ''
                },
                4: {
                  codingSchemeAnswerId: 4,
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
            questionType: 3
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {},
              comment: ''
            }
          }
        })
      )
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }

      const state = getReducer(
        getState({
          question: {
            questionType: 4,
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: 'pincite!' }
                  }
                },
                2: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 0,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        }),
        action
      )

      expect(state).toEqual(
        getState({
          question: {
            questionType: 4,
            isCategoryChild: true
          },
          userAnswers: {
            2: {
              codingSchemeQuestionId: 2,
              answers: {
                3: {
                  answers: {}
                },
                2: {
                  answers: {
                    4: { codingSchemeAnswerId: 4, pincite: '' }
                  }
                }
              },
              comment: ''
            }
          },
          selectedCategory: 0,
          categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
        })
      )
    })
  })
})