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
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: null
}

const getState = other => ({ ...initial, ...other })
const getReducer = (state, action) => reducer(state, action)

describe('Coding reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({ ...initial, codedQuestionsError: null, getQuestionErrors: null, schemeError: null })
  })

  describe('GET_CODING_OUTLINE_SUCCESS', () => {
    test('should set outline, scheme, current question and userAnswers based on action.payload', () => {
      const questions = {
        1: {
          text: 'fa la la la', questionType: 1, id: 1, parentId: 0,
          positionInParent: 0,
          possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        },
        2: {
          text: 'la la la', questionType: 2, id: 2, parentId: 0,
          positionInParent: 1, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
        }
      }

      const action = {
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload: {
          outline: {
            1: { parentId: 0, positionInParent: 0 },
            2: { parentId: 0, positionInParent: 1 }
          },
          scheme: {
            byId: questions,
            tree: [
              {
                text: 'fa la la la',
                questionType: 1,
                id: 1,
                parentId: 0,
                positionInParent: 0,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              },
              {
                text: 'la la la',
                questionType: 2,
                id: 2,
                parentId: 0,
                positionInParent: 1,
                possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
              }
            ],
            order: [1, 2]
          },
          userAnswers: {
            1: {
              answers: {
                3: { schemeAnswerId: 3, pincite: '' }
              },
              schemeQuestionId: 1,
              comment: ''
            }
          },
          question: questions[1],
          isSchemeEmpty: false,
          areJurisdictionsEmpty: false,
          userId: 1,
          errors: {}
        }
      }

      const state = getReducer(getState(), action)

      expect(state).toHaveProperty('outline', action.payload.outline)
      expect(state).toHaveProperty('scheme.byId', action.payload.scheme.byId)
      expect(state).toHaveProperty('scheme.order', action.payload.scheme.order)
      expect(state).toHaveProperty('question', action.payload.question)
      expect(state.userAnswers).toMatchObject(action.payload.userAnswers)
    })
  })

  describe('ON_SAVE_FLAG', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_SAVE_FLAG,
        questionId: 1,
        projectId: 1,
        jurisdictionId: 1,
        flagInfo: { notes: 'notes!!', type: 2 }
      }

      const state = getReducer(getState({
        question: { id: 1, isCategoryQuestion: false },
        userAnswers: {
          1: {
            flag: { notes: '', type: 0 }
          }
        }
      }), action)

      expect(state).toHaveProperty('userAnswers.1.flag', { notes: 'notes!!', type: 2 })
    })

    test('should handle category child questions', () => {
      const action = {
        type: types.ON_SAVE_FLAG,
        questionId: 1,
        projectId: 1,
        jurisdictionId: 1,
        flagInfo: { notes: 'notes!!', type: 2 }
      }

      const state = getReducer(getState({
        question: { id: 1, isCategoryQuestion: true },
        selectedCategoryId: 5,
        userAnswers: {
          1: {
            5: { flag: { notes: '', type: 0 } }
          }
        }
      }), action)

      expect(state).toHaveProperty('userAnswers.1.5.flag', { notes: 'notes!!', type: 2 })
    })
  })

  describe('ON_SAVE_RED_FLAG_SUCCESS', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_SAVE_RED_FLAG_SUCCESS,
        payload: { notes: 'notes!!', type: 3 }
      }

      const state = getReducer(getState({
        question: { id: 1, isCategoryQuestion: false, flags: [] },
        scheme: {
          byId: { 1: { id: 1, isCategoryQuestion: false, flags: [] } },
          tree: []
        }
      }), action)

      expect(state).toHaveProperty('question.flags', [{ notes: 'notes!!', type: 3 }])
      expect(state).toHaveProperty('scheme.byId.1.flags', [{ notes: 'notes!!', type: 3 }])
    })
  })
})

/* test('should initialize user answers to empty if payload.codedQuestions is empty', () => {
   const questions = [
     {
       text: 'fa la la la',
       questionType: 1,
       id: 1,
       parentId: 0,
       positionInParent: 0,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     },
     {
       text: 'la la la',
       questionType: 2,
       id: 2,
       parentId: 0,
       positionInParent: 1,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     }
   ]

   const action = {
     type: types.GET_CODING_OUTLINE_SUCCESS,
     payload: {
       scheme: questions,
       tree: [
         { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
         { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1 }
       ],
       questionOrder: [1, 2],
       outline: {
         1: { parentId: 0, positionInParent: 0 },
         2: { parentId: 0, positionInParent: 1 }
       },
       question: {
         text: 'fa la la la',
         questionType: 1,
         id: 1,
         parentId: 0,
         positionInParent: 0,
         possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
       },
       codedQuestions: []
     }
   }

   const state = getReducer(
     getState(),
     action
   )

   expect(state).toMatchObject(getState({
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
       order: [1, 2],
       tree: [
         { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0, isAnswered: false },
         { text: 'la la la', questionType: 2, id: 2, parentId: 0, positionInParent: 1, isAnswered: false }
       ]
     },
     userAnswers: {
       1: {
         answers: {},
         schemeQuestionId: 1,
         comment: ''
       }
     }
   }))
 })

 test('should handle category question children in codedQuestions array for userAnswers', () => {
   const questions = [
     {
       text: 'fa la la la',
       questionType: 1,
       id: 1,
       parentId: 0,
       positionInParent: 0,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     },
     {
       text: 'la la la',
       questionType: 2,
       id: 2,
       parentId: 0,
       positionInParent: 1,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     },
     {
       text: 'category question child',
       questionType: 4,
       id: 3,
       parentId: 2,
       positionInParent: 0,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     }
   ]

   const action = {
     type: types.GET_CODING_OUTLINE_SUCCESS,
     payload: {
       question: {
         id: 1,
         possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
       },
       scheme: questions,
       questionOrder: [1, 2, 3],
       outline: {
         1: { parentId: 0, positionInParent: 0 },
         2: { parentId: 0, positionInParent: 1 },
         3: { parentId: 2, positionInParent: 0 }
       },
       tree: [],
       codedQuestions: [
         {
           schemeQuestionId: 2,
           codedAnswers: [{ schemeAnswerId: 4, pincite: '' }, { schemeAnswerId: 5, pincite: '' }],
           comment: ''
         },
         {
           schemeQuestionId: 3,
           categoryId: 4,
           codedAnswers: [{ schemeAnswerId: 8, pincite: '' }, { schemeAnswerId: 6, pincite: '' }],
           comment: ''
         },
         {
           schemeQuestionId: 3,
           categoryId: 5,
           codedAnswers: [{ schemeAnswerId: 11, pincite: '' }, { schemeAnswerId: 8, pincite: '' }],
           comment: 'this is a comment'
         }
       ]
     }
   }

   const state = getReducer(getState(), action)

   expect(state.userAnswers).toMatchObject({
     1: {
       answers: {}
     },
     2: {
       answers: {
         4: { schemeAnswerId: 4, pincite: '' },
         5: { schemeAnswerId: 5, pincite: '' }
       },
       comment: '',
       schemeQuestionId: 2
     },
     3: {
       4: {
         answers: {
           8: { schemeAnswerId: 8, pincite: '' },
           6: { schemeAnswerId: 6, pincite: '' }
         },
         comment: '',
         flag: { notes: '', type: 0 },
         categoryId: 4,
         schemeQuestionId: 3
       },
       5: {
         answers: {
           11: { schemeAnswerId: 11, pincite: '' },
           8: { schemeAnswerId: 8, pincite: '' }
         },
         comment: 'this is a comment',
         flag: { notes: '', type: 0 },
         categoryId: 5,
         schemeQuestionId: 3
       }
     },
     1: {
       schemeQuestionId: 1,
       answers: {},
       comment: ''
     }
   })

 })

 test('should handle categories and children for scheme.tree', () => {
   const questions = [
     {
       text: 'fa la la la',
       questionType: 1,
       id: 1,
       parentId: 0,
       positionInParent: 0,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     },
     {
       text: 'la la la',
       questionType: 2,
       id: 2,
       parentId: 0,
       positionInParent: 1, possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     },
     {
       text: 'category question child',
       questionType: 4,
       id: 3,
       parentId: 2,
       positionInParent: 0,
       isCategoryQuestion: true,
       possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
     }
   ]

   const action = {
     type: types.GET_CODING_OUTLINE_SUCCESS,
     payload: {
       question: {
         id: 1,
         possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
       },
       scheme: questions,
       questionOrder: [1, 2, 3],
       tree: [
         { text: 'fa la la la', questionType: 1, id: 1, parentId: 0, positionInParent: 0 },
         {
           text: 'la la la',
           questionType: 2,
           id: 2,
           parentId: 0,
           positionInParent: 1,
           possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }],
           children: [
             {
               text: 'category question child',
               questionType: 4,
               id: 3,
               isCategoryQuestion: true,
               parentId: 2,
               positionInParent: 0
             }
           ]
         }
       ],
       codedQuestions: [
         {
           schemeQuestionId: 2,
           codedAnswers: [{ schemeAnswerId: 4, pincite: '' }, { schemeAnswerId: 5, pincite: '' }],
           comment: ''
         },
         {
           schemeQuestionId: 3,
           categoryId: 4,
           codedAnswers: [{ schemeAnswerId: 8, pincite: '' }, { schemeAnswerId: 6, pincite: '' }],
           comment: ''
         },
         {
           schemeQuestionId: 3,
           categoryId: 5,
           codedAnswers: [{ schemeAnswerId: 11, pincite: '' }, { schemeAnswerId: 8, pincite: '' }],
           comment: 'this is a comment'
         }
       ]
     }
   }

   const state = getReducer(getState(), action)

   expect(state)
     .toHaveProperty('scheme.tree', {
         text: 'fa la la la',
         questionType: 1,
         id: 1,
         parentId: 0,
         positionInParent: 0,
         isAnswered: false
       },
       {
         text: 'la la la',
         questionType: 2,
         id: 2,
         parentId: 0,
         positionInParent: 1,
         possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }],
         isAnswered: true,
         children: [
           {
             text: 'category question child',
             questionType: 4,
             id: 3,
             isCategoryQuestion: true,
             parentId: 2,
             positionInParent: 0,
             isAnswered: true
           }
         ]
       })
 })
})*/