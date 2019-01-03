export const schemeFromApi = [
  {
    text: 'fa la la la',
    hint: '',
    questionType: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    isCategoryQuestion: false,
    possibleAnswers: [{ id: 123, text: 'answer 1' }, { id: 234, text: 'answer 2' }]
  },
  {
    text: 'la la la',
    hint: '',
    questionType: 3,
    id: 2,
    parentId: 0,
    isCategoryQuestion: false,
    positionInParent: 1,
    possibleAnswers: [{ id: 9, text: 'check 1' }, { id: 8, text: 'check 2' }, { id: 7, text: 'check 3' }]
  }, {
    text: 'cat question',
    questionType: 2,
    id: 3,
    parentId: 0,
    hint: '',
    positionInParent: 2,
    isCategoryQuestion: false,
    possibleAnswers: [
      { id: 5, text: 'category 1', order: 1 },
      { id: 10, text: 'category 2', order: 2 },
      { id: 20, text: 'category 3', order: 3 }
    ]
  },
  {
    text: 'cat question child',
    questionType: 3,
    id: 4,
    parentId: 3,
    hint: '',
    positionInParent: 0,
    isCategoryQuestion: true,
    possibleAnswers: [
      { id: 432, text: 'answer 1', order: 1 },
      { id: 2124, text: 'answer 2', order: 2 }
    ]
  },
  {
    text: 'next sibling',
    questionType: 3,
    id: 5,
    parentId: 0,
    hint: '',
    isCategoryQuestion: false,
    positionInParent: 3,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

export const schemeById = {
  1: {
    text: 'fa la la la',
    hint: '',
    questionType: 1,
    id: 1,
    parentId: 0,
    indent: 0,
    isCategoryQuestion: false,
    number: '1',
    positionInParent: 0,
    possibleAnswers: [{ id: 123, text: 'answer 1' }, { id: 234, text: 'answer 2' }]
  },
  2: {
    text: 'la la la',
    hint: '',
    questionType: 3,
    id: 2,
    indent: 0,
    number: '2',
    parentId: 0,
    isCategoryQuestion: false,
    positionInParent: 1,
    possibleAnswers: [{ id: 9, text: 'check 1' }, { id: 8, text: 'check 2' }, { id: 7, text: 'check 3' }]
  },
  3: {
    text: 'cat question',
    questionType: 2,
    id: 3,
    parentId: 0,
    hint: '',
    indent: 0,
    number: '3',
    isCategoryQuestion: false,
    positionInParent: 2,
    possibleAnswers: [
      { id: 5, text: 'category 1', order: 1 },
      { id: 10, text: 'category 2', order: 2 },
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
    isCategoryQuestion: true,
    indent: 1,
    number: '3.1',
    possibleAnswers: [
      { id: 432, text: 'answer 1', order: 1 },
      { id: 2124, text: 'answer 2', order: 2 }
    ]
  },
  5: {
    text: 'next sibling',
    questionType: 3,
    id: 5,
    parentId: 0,
    positionInParent: 3,
    isCategoryQuestion: false,
    hint: '',
    indent: 0,
    number: '4',
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
}

export const schemeOrder = [1, 2, 3, 4, 5]

export const schemeTree = [
  {
    text: 'fa la la la',
    questionType: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    isCategoryQuestion: false,
    indent: 0,
    number: '1',
    hint: '',
    possibleAnswers: [{ id: 123, text: 'answer 1' }, { id: 234, text: 'answer 2' }]
  },
  {
    text: 'la la la',
    questionType: 3,
    id: 2,
    parentId: 0,
    positionInParent: 1,
    indent: 0,
    number: '2',
    hint: '',
    isCategoryQuestion: false,
    possibleAnswers: [{ id: 9, text: 'check 1' }, { id: 8, text: 'check 2' }, { id: 7, text: 'check 3' }]
  },
  {
    text: 'cat question',
    questionType: 2,
    id: 3,
    parentId: 0,
    positionInParent: 2,
    hint: '',
    number: '3',
    expanded: true,
    indent: 0,
    isCategoryQuestion: false,
    possibleAnswers: [
      { id: 5, text: 'category 1', order: 1 },
      { id: 10, text: 'category 2', order: 2 },
      { id: 20, text: 'category 3', order: 3 }
    ],
    children: [
      {
        text: 'cat question child',
        questionType: 3,
        id: 4,
        indent: 1,
        number: '3.1',
        hint: '',
        parentId: 3,
        positionInParent: 0,
        isCategoryQuestion: true,
        possibleAnswers: [
          { id: 432, text: 'answer 1', order: 1 }, { id: 2124, text: 'answer 2', order: 2 }
        ]
      }
    ]
  },
  {
    text: 'next sibling',
    questionType: 3,
    id: 5,
    parentId: 0,
    positionInParent: 3,
    isCategoryQuestion: false,
    hint: '',
    indent: 0,
    number: '4',
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

export const schemeOutline = {
  1: { parentId: 0, positionInParent: 0 },
  2: { parentId: 0, positionInParent: 1 },
  3: { parentId: 0, positionInParent: 2 },
  4: { parentId: 3, positionInParent: 0 },
  5: { parentId: 0, positionInParent: 3 }
}

export const schemeUserAnswersEmpty = {
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
    answers: {}
  },
  4: {
    10: { answers: {}, comment: '', flag: {} },
    20: { answers: {}, comment: '', flag: {} },
    5: { answers: {}, comment: '', flag: {} }
  },
  5: {
    schemeQuestionId: 5,
    answers: {}
  }
}

export const userCodedQuestions = [
  {
    id: 10019,
    schemeQuestionId: 1,
    flag: null,
    comment: '',
    codedAnswers: [
      {
        id: 10010,
        schemeAnswerId: 123,
        pincite: 'dsfdfdsf',
        textAnswer: null,
        annotations: []
      }
    ]
  },
  {
    id: 4443,
    schemeQuestionId: 3,
    flag: null,
    comment: '',
    codedAnswers: [
      {
        schemeAnswerId: 10,
        pincite: '',
        textAnswer: null,
        annotations: []
      },
      {
        schemeAnswerId: 20,
        pincite: '',
        textAnswer: null,
        annotations: []
      }
    ]
  }
]

export const userAnswersCoded = {
  1: {
    answers: {
      123: {
        id: 10010,
        schemeAnswerId: 123,
        pincite: 'dsfdfdsf',
        annotations: [],
        textAnswer: null
      }
    },
    schemeQuestionId: 1,
    comment: '',
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 10019,
    isNewCodedQuestion: false
  },
  3: {
    schemeQuestionId: 3,
    comment: '',
    answers: {
      10: { schemeAnswerId: 10, pincite: '', annotations: [], textAnswer: null },
      20: { schemeAnswerId: 20, pincite: '', annotations: [], textAnswer: null }
    },
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 4443,
    isNewCodedQuestion: false
  }
}

export const docListPayload = [
  {
    name: 'document 1',
    _id: '1234',
    uploadedDate: new Date('12/10/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  },
  {
    name: 'document 2',
    _id: '5678',
    uploadedDate: new Date('12/09/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  },
  {
    name: 'document 3',
    _id: '9101',
    uploadedDate: new Date('02/10/2018'),
    uploadedBy: { firstName: 'test', lastName: 'user' }
  }
]