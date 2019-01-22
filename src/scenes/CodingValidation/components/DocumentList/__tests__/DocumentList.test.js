import React from 'react'
import { shallow } from 'enzyme'
import { DocumentList } from '../index'

const props = {
  actions: {
    getApprovedDocumentsRequest: jest.fn(),
    saveAnnotation: jest.fn()
  },
  jurisdictionId: 1,
  projectId: 1,
  page: 'coding',
  documents: [
    { name: 'doc1', _id: 12344 }
  ],
  answerSelected: null,
  questionId: 3,
  annotatedDocs: [],
  docSelected: false,
  openedDoc: {},
  saveUserAnswer: jest.fn()
}

describe('DocumentList', () => {
  test('should render DocumentList component correctly', () => {
    expect(shallow(<DocumentList {...props} />)).toMatchSnapshot()
  })

  test('should show PDFViewer when docSelected is true', () => {
    const wrapper = shallow(<DocumentList {...props} docSelected={true} />)
    expect(wrapper.find('PDFViewer')).toHaveLength(1)
  })

  test('should have quote icons when document is in annotated list', () => {
    const wrapper = shallow(<DocumentList {...props} annotatedDocs={[12344]} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
  })

  test('should call this.props.saveAnnotation when this.onSaveAnnotation is called', () => {
    const spy = jest.spyOn(props.actions, 'saveAnnotation')
    const wrapper = shallow(<DocumentList {...props} answerSelected={4} />)
    wrapper.instance().onSaveAnnotation({ text: 'test annotation' })
    expect(spy).toHaveBeenCalledWith({ text: 'test annotation' }, 4, 3)
  })

  test('should call this.props.saveUserAnswer when this.onSaveAnnotation is called', () => {
    const spy = jest.spyOn(props, 'saveUserAnswer')
    const wrapper = shallow(<DocumentList {...props} answerSelected={4} />)
    wrapper.instance().onSaveAnnotation({ text: 'test annotation' })
    expect(spy).toHaveBeenCalled()
  })
})