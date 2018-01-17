export const scheme = [
  {
    type: 1,
    text: 'Does the state have rabies vaccination laws for domestic dogs, cats, or ferrets?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 1001, text: 'Yes' }, { id: 1002, text: 'No' }],
    id: 1
  },
  {
    type: 3,
    text: 'What animals do the state\'s rabies vaccination laws apply to? (select all that apply)',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 1003, text: 'Cats' }, { id: 1004, text: 'Dogs' }, { id: 1005, text: 'Ferrets' }],
    id: 2
  },
  {
    type: 5,
    text: 'By what age must initial vaccination occur?',
    hint: '',
    comment: false,
    possibleAnswers: [],
    id: 3
  },
  {
    type: 5,
    text: 'By what age must subsequent vaccinations occur, or for how long does immunity last?',
    hint: '',
    comment: false,
    possibleAnswers: [],
    id: 4
  },
  {
    type: 4,
    text: 'Is a certificate issued after rabies vaccination?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 1007, text: 'Yes'}, { id: 1008, text: 'No'}, { id: 1009, text: 'Unclear' }],
    id: 5
  },
  {
    type: 1,
    text: 'Are tags issued after rabies vaccination?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 1010, text: 'Yes' }, { id: 1011, text: 'No' }],
    id: 6
  },
  {
    type: 4,
    text: 'Is rabies vaccination required to obtain a license or registration for the animal?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 1012, text: 'Yes'}, { id: 1013, text: 'No'}, { id: 1014, text: 'Unclear' }],
    id: 7
  },
  {
    type: 5,
    text: 'Are there exemptions for vaccination or certificate requirements for animals in the state?',
    hint: '',
    comment: false,
    possibleAnswers: [],
    id: 8
  },
  {
    type: 3,
    text: 'What are the vaccinations or certificate exemptions for animals in the state?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 34546, text: 'Rabies' }, { id: 4354, text: 'Other' }, { id: 24155, text: 'Feline Herpes' }],
    id: 9
  },
  {
    type: 1,
    text: 'Does the state have laws regarding rabies vaccinations for animals entering the state?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 63, text: 'Yes'}, { id: 456, text: 'No'}],
    id: 10
  },
  {
    type: 1,
    text: 'Does the state’s law reference any version of the National Association of State Public Health Veterinarians (NASPHV), Compendium of Animal Rabies Prevention and Control (Compendium)?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 15563, text: 'Yes'}, { id: 1234, text: 'No'}],
    id: 11
  },
  {
    type: 3,
    text: 'To what animals do the state\'s rabies vaccination laws for entry apply?',
    hint: '',
    comment: false,
    possibleAnswers: [{ id: 2003, text: 'Cats' }, { id: 2004, text: 'Dogs' }, { id: 2005, text: 'Ferrets' }],
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