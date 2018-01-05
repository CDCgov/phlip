import Chance from 'chance'

const chance = new Chance()

export const scheme = [
  { type: 'mc', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'binary', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'cat', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'cb', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'text', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'mc', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'binary', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'cat', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'cb', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'text', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] },
  { type: 'mc', questionBody: chance.paragraph({ sentences: 2}), hint: '', comment: false, answers: [], children: [] }
]