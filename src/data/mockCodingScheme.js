export const scheme = [

  {
    type: 'mc',
    questionBody: 'Does the state have rabies vaccination laws for domestic dogs, cats, or ferrets?',
    hint: '',
    comment: false,
    answers: [],
    id: 1
  },
  {
    type: 'cb',
    questionBody: 'What animals do the state\'s rabies vaccination laws apply to? (select all that apply)',
    hint: '',
    comment: false,
    answers: [],
    id: 2
  },
  {
    type: 'text',
    questionBody: 'By what age must initial vaccination occur?',
    hint: '',
    comment: false,
    answers: [],
    id: 3
  },
  {
    type: 'mc',
    questionBody: 'By what age must subsequent vaccinations occur, or for how long does immunity last?',
    hint: '',
    comment: false,
    answers: [],
    id: 4
  },
  {
    type: 'binary',
    questionBody: 'Is a certificate issued after rabies vaccination?',
    hint: '',
    comment: false,
    answers: [],
    id: 5
  },
  {
    type: 'cat',
    questionBody: 'Are tags issued after rabies vaccination?',
    hint: '',
    comment: false,
    answers: [],
    id: 6
  },
  {
    type: 'cb',
    questionBody: 'Is rabies vaccination required to obtain a license or registration for the animal?',
    hint: '',
    comment: false,
    answers: [],
    id: 7
  },
  {
    type: 'text',
    questionBody: 'Are there exemptions for vaccination or certificate requirements for animals in the state?',
    hint: '',
    comment: false,
    answers: [],
    id: 8
  },
  {
    type: 'binary',
    questionBody: 'What are the vaccinations or certificate exemptions for animals in the state?',
    hint: '',
    comment: false,
    answers: [],
    id: 9
  },
  {
    type: 'binary',
    questionBody: 'Does the state have laws regarding rabies vaccinations for animals entering the state?',
    hint: '',
    comment: false,
    answers: [],
    id: 10
  },
  {
    type: 'cat',
    questionBody: 'Does the state’s law reference any version of the National Association of State Public Health Veterinarians (NASPHV), Compendium of Animal Rabies Prevention and Control (Compendium)?',
    hint: '',
    comment: false,
    answers: [],
    id: 11
  },
  {
    type: 'mc',
    questionBody: 'To what animals do the state\'s rabies vaccination laws for entry apply?',
    hint: '',
    comment: false,
    answers: [],
    id: 12
  }
]

export const outline = {
  1: { parentId: 0, positionInParent: 0 },
  2: { parentId: 1, positionInParent: 1 },
  3: { parentId: 1, positionInParent: 0 },
  4: { parentId: 1, positionInParent: 2 },
  5: { parentId: 1, positionInParent: 4 },
  6: { parentId: 1, positionInParent: 3 },
  7: { parentId: 1, positionInParent: 5 },
  8: { parentId: 1, positionInParent: 6 },
  9: { parentId: 8, positionInParent: 0 },
  10: { parentId: 0, positionInParent: 1 },
  11: { parentId: 0, positionInParent: 2 },
  12: { parentId: 10, positionInParent: 0 }
}